import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from "@angular/core";
import { RfqMaterialResponse, RfqMat } from "src/app/shared/models/RFQ/rfq-details";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { initiatePo, initiatePoData } from "src/app/shared/models/PO/po-data";
import { POService } from "src/app/shared/services/po/po.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { isPlatformBrowser } from "@angular/common";


@Component({
  selector: "app-po-quantity-makes",
  templateUrl: "./po-quantity-makes.component.html"
})
export class PoQuantityMakesComponent implements OnInit, OnChanges {
  @Input() poData: initiatePoData;
  @Output() finalPoData = new EventEmitter<any>();
  initiatePoData: initiatePo = {} as initiatePo;
  suppliers: Suppliers;
  displayedColumns: string[] = ["Material Name", "Required Date", "Requested Qty", "Fullfillment Date", "Estimated Qty", "Estimated Rate", "Quantity", "Makes"];
  materialForms: FormGroup;
  checkedMaterialsList: RfqMaterialResponse[];
  constructor(private navService: AppNavigationService, private route: ActivatedRoute, private router: Router, private poService: POService, private formBuilder: FormBuilder) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.poData)
      this.checkedMaterialsList = this.poData.selectedMaterial;
    if (this.checkedMaterialsList) {
      this.formsInit();
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
            materialUnitPrice: [item.estimatedRate],
            materialQty: [item.quantity, Validators.required],
            brandNames: [item.makes],
            materialId: [item.materialId],
            fullfilmentDate: [item.dueDate != "" || item.dueDate != null ? item.dueDate : null]
          });
        });
      })
      .flat();
    this.materialForms = this.formBuilder.group({});
    this.materialForms.addControl("forms", new FormArray(frmArr));
    console.log("form array", frmArr);

    console.log("material form", this.materialForms);
  }

  makesUpdate(data: string[], grpIndex: number) {
    console.log(data, grpIndex);

    const forms = this.materialForms.get("forms") as FormArray;
    forms.controls[grpIndex].get("brandNames").setValue(data);

    console.log(this.materialForms);
  }
  materialAdded() {
    this.checkedMaterialsList.map(project => {
      this.initiatePoData.projectId = project.projectId;
      this.initiatePoData.projectName = project.projectName;
      this.initiatePoData.projectAddressId = project.defaultAddress.projectAddressId;
      this.initiatePoData.supplierId = this.poData.selectedSupplier.supplierId;
      this.initiatePoData.supplierAddressId = null;
      this.initiatePoData.supplierName = this.poData.selectedSupplier.supplier_name;
      this.initiatePoData.rfqId = null;
      this.materialForms.value.forms = this.materialForms.value.forms.map(material => {
        if (material.fullfilmentDate === "") {
          material.fullfilmentDate = null;
        }
        return material
      });
      this.initiatePoData.materialList = this.materialForms.value.forms;
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
    console.log(this.initiatePoData);
  }
  sendDataBack() {
    this.poData.selectedMaterial[0].projectMaterialList = this.poData.selectedMaterial[0].projectMaterialList.map((mat: RfqMat) => {
      for (let material of this.materialForms.value.forms) {
        if (material.materialId === mat.materialId) {
          mat.quantity = material.materialQty;
          mat.makes = material.brandNames;
          mat.estimatedRate = material.materialUnitPrice
        }
      }
      return mat;
    })
    const poData: initiatePoData = {
      selectedMaterial: this.poData.selectedMaterial,
      selectedSupplier: this.poData.selectedSupplier
    }
    this.finalPoData.emit(poData)
  }


}
