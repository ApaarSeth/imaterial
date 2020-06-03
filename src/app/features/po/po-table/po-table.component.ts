import { Component, OnInit, Input, OnDestroy, ViewChild, Output, EventEmitter, HostListener } from "@angular/core";
import { PoMaterial, PurchaseOrder, PurchaseOrderCurrency } from "src/app/shared/models/PO/po-data";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { ignoreElements, debounceTime } from "rxjs/operators";
import { Subscription, combineLatest } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { POService } from "src/app/shared/services/po/po.service";
import { CommonService } from 'src/app/shared/services/commonService';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { MatSnackBar } from '@angular/material';
import { rfqCurrency } from 'src/app/shared/models/RFQ/rfq-details';

@Component({
  selector: "app-po-table",
  templateUrl: "./po-table.component.html"
})
export class PoTableComponent implements OnInit, OnDestroy {
  @Input("poTableData") poTableData: PoMaterial[];
  @Input("purchaseOrderCurrency") purchaseOrderCurrency: PurchaseOrderCurrency;
  @Input("mode") modes: string;
  @Output("QuantityAmountValidation") QuantityAmountValidation = new EventEmitter();
  gst: string = '';
  words: string = "";
  showResponsiveDesign: boolean;
  poCurrency: PurchaseOrderCurrency
  constructor(private commonService: CommonService, private poService: POService, private route: ActivatedRoute, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) { }
  poForms: FormGroup;
  mode: string;
  initialCounter = 0;
  isPoValid: boolean
  a: number = 0;
  subscriptions: Subscription[] = [];
  minDate = new Date();
  ngOnInit() {
    window.dispatchEvent(new Event('resize'));
    this.route.params.subscribe(params => {
      this.mode = params.mode;
    });
    this.formInit();
  }

  ngOnChanges(): void {
    this.poCurrency = this.purchaseOrderCurrency
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

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
          const gstCalc = formVal.materialQuantity * formVal.materialUnitPrice * (formVal.gst / 100);
          const calc = amount + gstCalc;
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }
  sumbit() {
    this.getData();
  }

  getData(): PoMaterial[] {
    return this.poForms.value.forms.map(material => {

      if (material.fullfilmentDate === "" || material.fullfilmentDate === null) {
        material.fullfilmentDate = null;
      }
      else {
        let date = new Date(this.commonService.formatDate(material.fullfilmentDate))
        let dummyMonth = date.getMonth() + 1;
        const year = date.getFullYear().toString();
        const month = dummyMonth > 10 ? dummyMonth.toString() : "0" + dummyMonth.toString();
        const day = date.getDate() > 10 ? date.getDate().toString() : "0" + date.getDate().toString();
        material.fullfilmentDate = year + "-" + month + "-" + day;
      }
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
      }, 0);
    } else {
      return this.poTableData[m].purchaseOrderDetailList.reduce((total, purchase: PurchaseOrder) => {
        total += Number(purchase.qty);
        if (Number(total.toFixed(2)) > Number(this.poTableData[m].poAvailableQty)) {
          this.poTableData[m].validQuantity = false;
        }
        else {
          this.poTableData[m].validQuantity = true;
        }
        let isValidQty: boolean = true;
        this.poTableData.forEach(element => {
          if (!element.validQuantity)
            isValidQty = false;
        });

        this.QuantityAmountValidation.emit(isValidQty);

        return total;
      }, 0);
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
    this.poTableData[m].purchaseOrderDetailList[p].qty = event.target.value;
    let totalQty = this.getMaterialQuantity(m);
    if (totalQty.toFixed(2) > materialAvailableQty) {
      this._snackBar.open("Net Quantity must be less than " + materialAvailableQty, "", {
        duration: 2000,
        panelClass: ["success-snackbar"],
        verticalPosition: "bottom"
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (event.currentTarget.innerWidth <= 1100) {
      this.showResponsiveDesign = true;
    } else {
      this.showResponsiveDesign = false;
    }
  }
}
