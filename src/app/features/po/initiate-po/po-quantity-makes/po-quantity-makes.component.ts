import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray, ValidatorFn, AbstractControl } from "@angular/forms";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { initiatePo, initiatePoData } from "src/app/shared/models/PO/po-data";
import { POService } from "src/app/shared/services/po.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { SelectCurrencyComponent } from 'src/app/shared/dialogs/select-currency/select-currency.component';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RfqMaterialResponse, rfqCurrency, RfqMat } from "../../../../shared/models/RFQ/rfq-details";


@Component({
  selector: "app-po-quantity-makes",
  templateUrl: "./po-quantity-makes.component.html"
})
export class PoQuantityMakesComponent implements OnInit, OnChanges {
  @Input() poData: initiatePoData;
  @Input() searchVal: any;
  @Output() finalPoData = new EventEmitter<any>();
  initiatePoData: initiatePo = {} as initiatePo;
  suppliers: Suppliers;
  displayedColumns: string[] = ["Material Name", "Required Date", "Requested Qty", "Fullfillment Date", "Estimated Qty", "Estimated Rate", "Quantity", "Makes"];
  materialForms: FormGroup;
  minDate = new Date();
  checkedMaterialsList: RfqMaterialResponse[];
  poCurrency: rfqCurrency;
  isMobile: boolean;
  constructor(
    private dialog: MatDialog,
    private commonService: CommonService,
    private navService: AppNavigationService,
    private router: Router,
    private poService: POService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.poData && changes.poData.currentValue) {
      this.poCurrency = changes.poData.currentValue.poCurrency;
      this.checkedMaterialsList = [...changes.poData.currentValue.selectedMaterial];
      if (this.checkedMaterialsList) {
        this.formsInit();
      }
    }
    if (changes.searchVal && changes.searchVal.currentValue) {
      this.searchText = '';
    }

  }

  formsInit() {
    const temp = 0;
    const frmArr = this.checkedMaterialsList
      .map((subCat, i) => {
        if (i !== 0) {
          subCat.prevMatListLength = this.checkedMaterialsList[i - 1].projectMaterialList.length;
        }
        return subCat.projectMaterialList.map(item => {

          return this.formBuilder.group({
            materialUnitPrice: [item.estimatedRate, Validators.pattern(FieldRegExConst.RATES)],
            materialQty: [item.quantity, [Validators.required, this.quantityCheck(item.poAvailableQty < 0 ? 0 : item.poAvailableQty)]],
            brandNames: [item.makes],
            materialId: [item.materialId],
            fullfilmentDate: [item.dueDate, [this.dateCheck()]]
          });
        });
      })
      .flat();
    this.materialForms = this.formBuilder.group({});
    this.materialForms.addControl("forms", new FormArray(frmArr));
  }

  dateCheck(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value != '' && control.value != null && new Date(control.value) < new Date()) {
        return { 'oldDate': true };
      }
      return null;
    }
  }
  quantityCheck(availableQuantity): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (availableQuantity < control.value) {
        control.setValue(0)
        return { 'greaterQuantity': true };
      }
      return null;
    }
  }

  makesUpdate(data: string[], grpIndex: number) {

    const forms = this.materialForms.get("forms") as FormArray;
    forms.controls[grpIndex].get("brandNames").setValue(data);

  }
  materialAdded() {
    this.checkedMaterialsList.map(project => {
      this.initiatePoData.rfqCurrency = this.poCurrency;
      this.initiatePoData.projectId = project.projectId;
      this.initiatePoData.projectName = project.projectName;
      this.initiatePoData.projectAddressId = project.defaultAddress.projectAddressId;
      this.initiatePoData.supplierId = this.poData.selectedSupplier.supplierId;
      this.initiatePoData.supplierAddressId = null;
      this.initiatePoData.supplierName = this.poData.selectedSupplier.supplierName;
      this.initiatePoData.rfqId = null;
      this.materialForms.value.forms = this.materialForms.value.forms.map(material => {
        material.materialUnitPrice = Number(material.materialUnitPrice);
        material.materialQty = Number(material.materialQty);
        if (material.fullfilmentDate === "" || material.fullfilmentDate === null) {
          material.fullfilmentDate = null;
        }
        else {
          material.fullfilmentDate = this.commonService.checkDate(material.fullfilmentDate);
        }
        return material
      });
      this.initiatePoData.materialList = this.materialForms.value.forms;

      // to attach document list for selected material
      project.projectMaterialList.forEach((e1) => this.initiatePoData.materialList.forEach((e2) => {
        if (e1.materialId === e2.materialId) {
          e2.documentList = e1.documentsList;
        }
      }
      ));

    });

    this.poService.initiatePo([this.initiatePoData]).then(res => {
      this.navService.gaEvent({
        action: 'submit',
        category: 'material-name',
        label: 'material name',
        value: null
      });
      this.router.navigate(["/po/po-generate/" + res.data[0] + "/edit"]);
    });
  }
  sendDataBack() {
    this.poData.selectedMaterial[0].projectMaterialList = this.poData.selectedMaterial[0].projectMaterialList.map((mat: RfqMat) => {
      for (let material of this.materialForms.value.forms) {
        if (material.materialId === mat.materialId) {
          mat.quantity = material.materialQty;
          mat.makes = material.brandNames;
          mat.estimatedRate = material.materialUnitPrice
          mat.fullfilmentDate = material.fullfilmentDate ? this.commonService.checkDate(material.fullfilmentDate) : null;
        }
      }
      return mat;
    })
    const poData: initiatePoData = {
      selectedMaterial: this.poData.selectedMaterial,
      selectedSupplier: this.poData.selectedSupplier,
      poCurrency: this.poCurrency
    }
    this.finalPoData.emit(poData)
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


}
