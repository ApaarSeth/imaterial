import { Component, OnInit, Input } from "@angular/core";
import { PoMaterial, PurchaseOrder } from "src/app/shared/models/PO/po-data";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";

@Component({
  selector: "app-po-table",
  templateUrl: "./po-table.component.html",
  styleUrls: ["./po-table.component.scss"]
})
export class PoTableComponent implements OnInit {
  @Input("poTableData") poTableData: PoMaterial[];
  @Input("viewMode") viewMode: boolean;

  constructor(private formBuilder: FormBuilder) {}
  poForms: FormGroup;
  ngOnInit() {
    this.formInit();
  }
  formInit() {
    const frmArr: FormGroup[] = this.poTableData.map(
      (poMaterial: PoMaterial) => {
        let purchaseGrp: FormGroup[] = poMaterial.purchaseOrderDetailList.map(
          (purchaseoder: PurchaseOrder) => {
            return this.formBuilder.group({
              id: [purchaseoder.materialId],
              status: [purchaseoder.status],
              created_by: [purchaseoder.created_by],
              created_at: [purchaseoder.created_at],
              last_updated_by: [purchaseoder.last_updated_by],
              last_updated_at: [purchaseoder.last_updated_at],
              projectName: [purchaseoder.projectName],
              addressId: [purchaseoder.addressId],
              addressLine1: [purchaseoder.addressLine1],
              addressLine2: [purchaseoder.addressLine2],
              city: [purchaseoder.city],
              state: [purchaseoder.state],
              countrypurchaseOrderDetailList: [purchaseoder.country],
              pinCode: [purchaseoder.pinCode],
              purchaseOrderDetailId: [purchaseoder.purchaseOrderDetailId],
              purchaseOrderId: [purchaseoder.purchaseOrderId],
              materialId: [purchaseoder.materialId],
              materialBrand: [purchaseoder.materialBrand],
              materialQuantity: [purchaseoder.materialQuantity],
              materialUnit: [purchaseoder.materialUnit],
              materialUnitPrice: [purchaseoder.materialUnitPrice],
              materialIgst: [1],
              materialSgst: [2],
              materialCgst: [],
              gst: []
            });
          }
        );
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
          purchaseOrderDetailList: this.formBuilder.array(purchaseGrp)
        });
      }
    );
    this.poForms = this.formBuilder.group({});
    this.poForms.addControl("forms", new FormArray(frmArr));
    console.log(this.poForms);
  }
  sumbit() {
    console.log(this.poForms.value.forms);
  }
  getData() {
    return this.poForms.value.forms;
  }
}
