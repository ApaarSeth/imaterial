import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { initiatePo } from "src/app/shared/models/PO/po-data";
import { POService } from "src/app/shared/services/po/po.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-po-quantity-makes",
  templateUrl: "./po-quantity-makes.component.html"
})
export class PoQuantityMakesComponent implements OnInit, OnChanges {
  @Input() selectedMaterial: RfqMaterialResponse[];
  @Input() selectedSupplier: Suppliers;
  initiatePoData: initiatePo = {} as initiatePo;
  suppliers: Suppliers;
  displayedColumns: string[] = [
    "Material Name",
    "Required Date",
    "Requested Quantity",
    "Estimated Quantity",
    "Estimated Rate",
    "Quantity",
    "Makes"
  ];
  materialForms: FormGroup;
  checkedMaterialsList: RfqMaterialResponse[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private poService: POService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.selectedSupplier);
    // this.suppliers = this.selectedSupplier.supplier;
    this.checkedMaterialsList = this.selectedMaterial;
    console.log("form init", this.checkedMaterialsList);
    console.log("supplier", this.selectedSupplier);
    if (this.checkedMaterialsList) {
      this.formsInit();
    }
  }

  formsInit() {
    const temp = 0;
    const frmArr = this.checkedMaterialsList
      .map((subCat, i) => {
        if (i !== 0) {
          subCat.prevMatListLength = this.checkedMaterialsList[
            i - 1
          ].projectMaterialList.length;
        }
        return subCat.projectMaterialList.map(item => {
          return this.formBuilder.group({
            materialUnitPrice: [item.estimatedRate, Validators.required],
            materialQty: [item.quantity, Validators.required],
            brandNames: [],
            materialId: [item.materialId]
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
      this.initiatePoData.projectAddressId =
        project.defaultAddress.projectAddressId;
      this.initiatePoData.supplierId = this.selectedSupplier.supplierId;
      this.initiatePoData.supplierAddressId = null;
      this.initiatePoData.supplierName = this.selectedSupplier.supplier_name;
      this.initiatePoData.rfqId = null;
      this.initiatePoData.materialList = this.materialForms.value.forms;
    });
    this.poService.initiatePo([this.initiatePoData]).then(res => {
      this.router.navigate(["/po/po-generate/" + res.data[0]], {
        state: { mode: "edit" }
      });
    });
    console.log(this.initiatePoData);
  }
}
