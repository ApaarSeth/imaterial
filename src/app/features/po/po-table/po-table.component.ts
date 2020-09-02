import { Component, OnInit, Input, OnDestroy, ViewChild, Output, EventEmitter, HostListener, ChangeDetectorRef } from "@angular/core";
import { PoMaterial, PurchaseOrder, PurchaseOrderCurrency, POData } from "src/app/shared/models/PO/po-data";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { ignoreElements, debounceTime } from "rxjs/operators";
import { Subscription, combineLatest } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { POService } from "src/app/shared/services/po.service";
import { CommonService } from 'src/app/shared/services/commonService';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { rfqCurrency } from 'src/app/shared/models/RFQ/rfq-details';
import { TaxCostComponent } from 'src/app/shared/dialogs/tax-cost/tax-cost.component';
import { OverallOtherCost } from 'src/app/shared/models/common.models';
import { OtherCostInfo } from 'src/app/shared/models/tax-cost.model';
import { SelectCurrencyComponent } from 'src/app/shared/dialogs/select-currency/select-currency.component';
import { UploadImageComponent } from 'src/app/shared/dialogs/upload-image/upload-image.component';
import { ViewImageComponent } from 'src/app/shared/dialogs/view-image/view-image.component';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-po-table",
  templateUrl: "./po-table.component.html"
})
export class PoTableComponent implements OnInit, OnDestroy {
  @Input("poTableData") poTableData: PoMaterial[];
  @Input("poData") poData: POData;
  @Input("purchaseOrderCurrency") currency: { isInternational: number, purchaseOrderCurrency: PurchaseOrderCurrency };
  @Input("additionalOtherCostInfo") additionalOtherCostInfo: { additionalOtherCostAmount: number, additionalOtherCostInfo: OverallOtherCost[] };
  @Input("mode") modes: string;
  @Output("QuantityAmountValidation") QuantityAmountValidation = new EventEmitter();
  gst: string = '';
  words: string = "";
  toggleCounter: number = 0;
  showResponsiveDesign: boolean;
  poCurrency: PurchaseOrderCurrency
  poId: number;
  constructor(private cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute, private dialog: MatDialog, private commonService: CommonService, private poService: POService, private route: ActivatedRoute, private formBuilder: FormBuilder, private _snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef) { }
  poForms: FormGroup;
  mode: string;
  initialCounter = 0;
  isPoValid: boolean
  a: number = 0;
  subscriptions: Subscription[] = [];
  minDate = new Date();
  isInternational: number;
  taxAndCostData;
  otherCostData: OverallOtherCost[];
  totalAdditionalCost: number = 0;
  additonalCost: { additionalOtherCostAmount: number, additionalOtherCostInfo: OverallOtherCost[] }
  ratesBaseCurr: boolean = false;
  isMobile: boolean;
  taxCounter: number = 0;
  ngOnInit() {
    window.dispatchEvent(new Event('resize'));
    this.route.params.subscribe(params => {
      this.mode = params.mode;
      this.poId = Number(params['id']);
    });
    this.isMobile = this.commonService.isMobile().matches;
    this.formInit();
  }

  ngOnChanges(): void {
    this.isInternational = this.currency.isInternational;
    this.poCurrency = this.currency.purchaseOrderCurrency;
    this.additonalCost = this.additionalOtherCostInfo;
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  formInit() {
    const frmArr: FormGroup[] = this.poTableData.map((poMaterial: PoMaterial, i) => {
      let purchaseGrp: FormGroup[] = poMaterial.purchaseOrderDetailList.map((purchaseorder: PurchaseOrder, j) => {
        const frmGrp: FormGroup = this.formBuilder.group({
          id: [purchaseorder.materialId],
          status: [purchaseorder.status],
          created_by: [purchaseorder.created_by],
          created_at: [purchaseorder.createdAt],
          last_updated_by: [purchaseorder.last_updated_by],
          last_updated_at: [purchaseorder.last_updated_at],
          projectName: [purchaseorder.projectName],
          addressId: [purchaseorder.addressId],
          addressLine1: [purchaseorder.addressLine1],
          addressLine2: [purchaseorder.addressLine2],
          city: [purchaseorder.city],
          state: [purchaseorder.state],
          countrypurchaseOrderDetailList: [purchaseorder.country],
          pinCode: [purchaseorder.pinCode],
          purchaseOrderDetailId: [purchaseorder.purchaseOrderDetailId],
          purchaseOrderId: [purchaseorder.purchaseOrderId],
          materialId: [purchaseorder.materialId],
          materialBrand: [purchaseorder.materialBrand],
          materialQuantity: [purchaseorder.materialQuantity],
          materialUnit: [],
          materialUnitPrice: [purchaseorder.materialUnitPrice, Validators.pattern(FieldRegExConst.RATES)],
          materialIgst: [1],
          materialSgst: [2],
          materialCgst: [],
          amount: [],
          gstAmount: [],
          gst: [(purchaseorder.materialSgst != 0 && purchaseorder.materialCgst != 0 ? purchaseorder.materialSgst + purchaseorder.materialCgst : purchaseorder.materialIgst), Validators.pattern(FieldRegExConst.RATES)],
          gstTotal: [],
          total: [{ value: "", disabled: false }]
        });
        this.gst = ((purchaseorder.materialCgst > 0) && (purchaseorder.materialSgst > 0)) ? 'CGST & SGST' : 'IGST';
        this.subscriptions.push(
          frmGrp.valueChanges.pipe(debounceTime(200)).subscribe(formVal => {
            updateTableValue(formVal);
          }),
        );
        const updateTableValue = formVal => {
          this.poTableData[i].purchaseOrderDetailList[j].qty = formVal.materialQuantity;
          const amount = formVal.materialQuantity * formVal.materialUnitPrice;
          const taxAmount = this.poTableData[i].purchaseOrderDetailList[j].taxAmount;
          const gstCalc = formVal.materialQuantity * formVal.materialUnitPrice * (formVal.gst / 100);
          const calc = amount + gstCalc + (taxAmount && this.isInternational ? taxAmount : 0);
          this.poTableData[i].purchaseOrderDetailList[j].amount = amount;
          this.poTableData[i].purchaseOrderDetailList[j].gstAmount = gstCalc;
          this.poTableData[i].purchaseOrderDetailList[j].total = calc;

          frmGrp.get("amount").setValue(amount);
          frmGrp.get("total").setValue(calc);
          frmGrp.get("gstAmount").setValue(gstCalc);
        };
        if (this.initialCounter == 0) {
          updateTableValue(frmGrp.value);
        }

        return frmGrp;
      });

      return this.formBuilder.group({
        materialId: [poMaterial.materialId],
        materialCode: [poMaterial.materialCode],
        projectId: [poMaterial.projectId],
        materialName: [poMaterial.materialName],
        materialGroup: [poMaterial.materialGroup],
        materialUnit: [poMaterial.materialUnit],
        estimatedQty: [poMaterial.estimatedQty],
        estimatedRate: [poMaterial.estimatedRate],
        materialCustomFlag: [poMaterial.materialCustomFlag],
        materialCustomId: [poMaterial.materialCustomId],
        materialSubGroup: [poMaterial.materialSubGroup],
        materialSpecs: [poMaterial.materialSpecs],
        requestedQuantity: [poMaterial.requestedQuantity],
        checked: false,
        issueToProject: [poMaterial.issueToProject],
        availableStock: [poMaterial.availableStock],
        indentDetailList: null,
        fullfilmentDate: [poMaterial.fullfilmentDate],
        purchaseOrderDetailList: this.formBuilder.array(purchaseGrp)
      });
    });
    this.poForms = this.formBuilder.group({});
    this.poForms.addControl("forms", new FormArray(frmArr));
  }
  setRateBaseCurr(value) {
    this.resetRate();
  }

  resetRate() {
    (<FormArray>this.poForms.get('forms')).controls.map(frmGrp => {
      (<FormArray>frmGrp.get('purchaseOrderDetailList')).controls.map(frmGrp => {
        if (this.poCurrency && this.poCurrency.exchangeValue)
          frmGrp.get('materialUnitPrice').setValue(frmGrp.get('materialUnitPrice').value / this.poCurrency.exchangeValue)
      })
    })
  }

  changeCurrency(event) {
    if (!this.ratesBaseCurr) {
      (<FormArray>this.poForms.get('forms')).controls.map(frmGrp => {
        (<FormArray>frmGrp.get('purchaseOrderDetailList')).controls.map(frmGrp => {
          if (this.poCurrency && this.poCurrency.exchangeValue)
            frmGrp.get('materialUnitPrice').setValue(frmGrp.get('materialUnitPrice').value * this.poCurrency.exchangeValue)
        })
      })
      this.toggleCounter++;
    }
    else if (this.toggleCounter > 0) {
      this.resetRate()
    }

  }

  get totalAmount(): number {
    let sum: number = 0;
    if (this.mode === "edit" && this.initialCounter != 0) {
      return this.poForms
        .getRawValue()
        .forms.map(frm => frm.purchaseOrderDetailList)
        .flat()
        .map(mat => mat.total)
        .reduce((a, b) => a + b);
    } else {
      this.poTableData.forEach((materials: PoMaterial) => {
        materials.purchaseOrderDetailList.forEach(mat => {
          sum += Number(mat.total);
        });
      });
      this.initialCounter++;
      return sum;
    }
  }

  get gstTotalAmount() {
    let sum = 0;
    if (this.mode === "edit" && this.initialCounter != 0) {
      return this.poForms
        .getRawValue()
        .forms.map(frm => frm.purchaseOrderDetailList)
        .flat()
        .map(mat => mat.gstAmount)
        .reduce((a, b) => a + b);
    } else {
      this.poTableData.map((materials: PoMaterial) => {
        materials.purchaseOrderDetailList.map(mat => {
          sum += Number(mat.gstAmount);
        });
      });
      return sum;
    }
  }

  getMaterialOtherCost(m) {
    return this.poTableData[m].otherCostAmount ? this.poTableData[m].otherCostAmount : 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  sumbit() {
    this.getData();
  }

  getUpdatedCurrency() {
    return this.poCurrency
  }

  getadditonalCost(): OtherCostInfo[] {
    return this.additonalCost.additionalOtherCostInfo;
  }

  getData(): PoMaterial[] {
    return this.poForms.value.forms.map((material, i) => {
      if (material.fullfilmentDate === "" || material.fullfilmentDate === null) {
        material.fullfilmentDate = null;
      }
      else {
        let date = new Date(this.commonService.formatDate(material.fullfilmentDate))
        let dummyMonth = date.getMonth() + 1;
        const year = date.getFullYear().toString();
        const month = dummyMonth > 9 ? dummyMonth.toString() : "0" + dummyMonth.toString();
        const day = date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();
        material.fullfilmentDate = year + "-" + month + "-" + day;
      }
      material.taxInfo = this.poTableData[i].taxInfo;
      material.otherCostInfo = this.poTableData[i].otherCostInfo;
      material.purchaseOrderDetailList.map(purchaseOrderList => {
        purchaseOrderList.materialQuantity = Number(purchaseOrderList.materialQuantity);
        purchaseOrderList.materialUnitPrice = Number(purchaseOrderList.materialUnitPrice);
        purchaseOrderList.gst = Number(purchaseOrderList.gst);
        if (this.gst === "IGST") {
          purchaseOrderList.materialIgst = purchaseOrderList.gst;
          purchaseOrderList.materialSgst = 0;
          purchaseOrderList.materialCgst = 0;
        } else {
          purchaseOrderList.materialIgst = 0;
          purchaseOrderList.materialSgst = purchaseOrderList.gst / 2;
          purchaseOrderList.materialCgst = purchaseOrderList.gst / 2;
        }
        return purchaseOrderList;
      });
      return material;
    });
  }

  getMaterialQuantity(m) {
    if (this.mode != "edit") {
      return this.poTableData[m].purchaseOrderDetailList.reduce((total: number, purchase: PurchaseOrder) => {
        return (total += Number(purchase.materialQuantity));
      }, 0)
    } else {
      return this.poTableData[m].purchaseOrderDetailList.reduce((total: number, purchase: PurchaseOrder) => {
        return (total += Number(purchase.qty));
      }, 0)
    }
  }

  getMaterialAmount(m) {
    if (this.mode != "edit") {
      return this.poTableData[m].purchaseOrderDetailList.reduce((total, purchase: PurchaseOrder) => {

        return (total += purchase.amount);
      }, 0);
    } else {
      return this.poTableData[m].purchaseOrderDetailList.reduce((total, purchase: PurchaseOrder) => {

        return (total += purchase.amount);
      }, 0);
    }
  }

  getMaterialGstAmount(m) {
    if (this.mode != "edit") {
      return this.poTableData[m].purchaseOrderDetailList.reduce((total, purchase: PurchaseOrder) => {
        return (total += purchase.gstAmount);
      }, 0);
    } else {
      return this.poTableData[m].purchaseOrderDetailList.reduce((total, purchase: PurchaseOrder) => {
        return (total += purchase.gstAmount);
      }, 0);
    }
  }

  getMaterialTotalAmount(m) {
    if (this.mode != "edit") {
      return this.poTableData[m].purchaseOrderDetailList.reduce((total, purchase: PurchaseOrder) => {
        return (total += purchase.total);
      }, 0);
    } else {
      return this.poTableData[m].purchaseOrderDetailList.reduce((total, purchase: PurchaseOrder) => {
        return (total += purchase.total);
      }, 0);
    }
  }

  checkQty(m, p, materialAvailableQty, event) {
    let tempVal = this.poTableData[m].purchaseOrderDetailList[p].qty;
    this.poTableData[m].purchaseOrderDetailList[p].qty = event.target.value;
    let totalQty = this.getMaterialQuantity(m);
    if (Number(totalQty.toFixed(2)) > materialAvailableQty) {
      this.poTableData[m].validQuantity = false;
      (<FormArray>(<FormArray>this.poForms.get('forms')).controls[m].get('purchaseOrderDetailList')).controls[p].get('materialQuantity').setValue(tempVal)
      this.poTableData[m].purchaseOrderDetailList[p].qty = 0
      this._snackBar.open("Net Quantity must be less than " + materialAvailableQty, "", {
        duration: 2000,
        panelClass: ["success-snackbar"],
        verticalPosition: "bottom"
      });
    }
  }



  selectCurrency() {
    const dialogRef = this.dialog.open(SelectCurrencyComponent, {
      disableClose: true,
      width: "500px",
      data: this.poCurrency,
      panelClass: ['common-modal-style', 'select-currency-dialog']
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.poCurrency = data;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (event.currentTarget.innerWidth <= 1100) {
      this.showResponsiveDesign = true;
    } else {
      this.showResponsiveDesign = false;
    }
  }

  getPOListTax(m, p, type) {
    let tax: number = 0;

    if (type === 'edit') {
      if (!this.poTableData[m]['counter']) {
        this.calculateTaxInfo(m)
        tax = this.poTableData[m]['totalTax'] ? this.poTableData[m]['totalTax'] : null
        this.poTableData[m]['counter'] = 1
      } else {
        tax = this.poTableData[m]['totalTax'] ? this.poTableData[m]['totalTax'] : null
      }
    }
    else {
      this.calculateTaxInfo(m)
      tax = this.poTableData[m]['totalTax'] ? this.poTableData[m]['totalTax'] : null
    }
    if (tax) {
      this.poTableData[m].purchaseOrderDetailList[p]['taxAmount'] = this.poTableData[m].purchaseOrderDetailList[p].amount * (tax ? tax / 100 : 0)
      return this.poTableData[m].purchaseOrderDetailList[p]['taxAmount']
    }
    else {
      this.poTableData[m].purchaseOrderDetailList[p]['taxAmount'] = null
      return this.poTableData[m].purchaseOrderDetailList[p]['taxAmount']
    }
  }

  calculateTaxInfo(mId) {
    if (this.poTableData[mId].taxInfo && this.poTableData[mId].taxInfo.length > 0) {
      if (this.poTableData[mId].taxInfo.length > 1) {
        this.poTableData[mId]['totalTax'] = this.poTableData[mId].taxInfo.map(val => { return val.taxValue }).reduce((a, b) => (a + b))
      }
      else {
        this.poTableData[mId]['totalTax'] = this.poTableData[mId].taxInfo[0].taxValue
      }
    } else {
      this.poTableData[mId]['totalTax'] = 0
    }
  }

  getTotalPOListTax(m) {
    if (this.poTableData[m].purchaseOrderDetailList.length > 1) {
      return this.poTableData[m].purchaseOrderDetailList.map(val => val.taxAmount).reduce((a, b) => (a + b))
    }
    else {
      return this.poTableData[m].purchaseOrderDetailList[0].taxAmount ? this.poTableData[m].purchaseOrderDetailList[0].taxAmount : 0;
    }
  }

  get totalTaxAmount() {
    let totalTax = 0;
    this.poTableData.forEach((val, i) => {
      if (val.purchaseOrderDetailList.length > 1) {
        totalTax += val.purchaseOrderDetailList.map(val => val.taxAmount).reduce((a, b) => (a + b))
      }
      else {
        totalTax += val.purchaseOrderDetailList[0].taxAmount ? val.purchaseOrderDetailList[0].taxAmount : 0;
      }
    })
    return totalTax;
  }

  get totalOtherAmount() {
    let totalOtherTax = 0;
    this.poTableData.forEach((val, i) => {
      totalOtherTax += val.otherCostAmount ? val.otherCostAmount : 0;
    })
    return totalOtherTax + (this.additonalCost.additionalOtherCostAmount ? this.additonalCost.additionalOtherCostAmount : 0);
  }


  getTotalOtherCost(m) {
    if (this.poTableData[m].otherCostAmount) {
      return this.poTableData[m].otherCostAmount;
    }
    else {
      return 0;
    }
  }



  calculateOtherTaxInfo(mId) {
    if (this.poTableData[mId].otherCostInfo && this.poTableData[mId].otherCostInfo.length > 0) {
      if (this.poTableData[mId].otherCostInfo.length > 1) {
        this.poTableData[mId]['otherCostAmount'] = this.poTableData[mId].otherCostInfo.map(val => { return val.otherCostAmount }).reduce((a, b) => (a + b))
      }
      else {
        this.poTableData[mId]['otherCostAmount'] = this.poTableData[mId].otherCostInfo[0].otherCostAmount
      }
    } else {
      this.poTableData[mId]['otherCostAmount'] = 0
    }
  }

  openTaxesCostsDialog(type: string, mId?: number) {
    let existingData = null;
    if (type === 'taxesAndCost') {
      existingData = {
        taxInfo: this.poTableData[mId].taxInfo ? this.poTableData[mId].taxInfo : null,
        otherCostInfo: this.poTableData[mId].otherCostInfo ? this.poTableData[mId].otherCostInfo : null
      }
    }
    else {
      existingData = {
        otherCostInfo: this.additonalCost.additionalOtherCostInfo
      }
    }

    const dialogRef = this.dialog.open(TaxCostComponent, {
      width: "600px",
      data: {
        prevData: null,
        type,
        po: true,
        rfqId: null,
        existingData,
        currency: this.poCurrency ? this.poCurrency.exchangeCurrencyName : null
      },
      panelClass: ['common-modal-style', 'tax-dialog']
    });
    dialogRef.afterClosed().subscribe(res => {
      if (type === 'taxesAndCost') {
        this.poTableData[mId].taxInfo = res && res.taxInfo ? res.taxInfo : this.poTableData[mId].taxInfo ? this.poTableData[mId].taxInfo : null;
        this.poTableData[mId].otherCostInfo = res && res.otherCostInfo ? res.otherCostInfo : this.poTableData[mId].otherCostInfo ? this.poTableData[mId].otherCostInfo : null;
        this.calculateTaxInfo(mId);
        this.calculateOtherTaxInfo(mId);
      }
      if (type === 'otherCost') {
        this.additonalCost.additionalOtherCostInfo = res && res.otherCostInfo ? res.otherCostInfo : this.additonalCost.additionalOtherCostInfo ? this.additonalCost.additionalOtherCostInfo : null;
        otherCost();
      }
    });

    let otherCost = () => {
      if (this.additonalCost.additionalOtherCostInfo && this.additonalCost.additionalOtherCostInfo.length > 0) {
        if (this.additonalCost.additionalOtherCostInfo.length > 1) {
          this.additonalCost.additionalOtherCostAmount = this.additonalCost.additionalOtherCostInfo.map(val => { return val.otherCostAmount }).reduce((a, b) => (a + b))
        }
        else {
          this.additonalCost.additionalOtherCostAmount = this.additonalCost.additionalOtherCostInfo[0].otherCostAmount
        }
      } else {
        this.additonalCost.additionalOtherCostAmount = 0
      }
    }

  }


  /**
   * function will call to upload new images
   * @param selectedMaterial, type
   */
  uploadImage(selectedMaterial, type) {
    const dialogRef = this.dialog.open(UploadImageComponent, {
      disableClose: true,
      width: "60vw",
      panelClass: ['common-modal-style', 'upload-image-modal'],
      data: {
        selectedMaterial,
        type,
        purchaseOrderId: this.poId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        this.poTableData.forEach(po => {
          po.purchaseOrderDetailList.map(list => {
            if (list.materialId === result.materialId) {
              list.documentList = result.documentsList;
            }
          });
        });
      }
    });
  }

  /**
   * function will call to open view image modal
   * @param rfqId, materialId, type
   */
  viewAllImages(materialId) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      disableClose: true,
      width: "500px",
      panelClass: ['common-modal-style', 'view-image-modal'],
      data: {
        purchaseOrderId: this.poId,
        materialId,
        type: 'po'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }
}
