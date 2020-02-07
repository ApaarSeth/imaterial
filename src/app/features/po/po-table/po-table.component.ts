import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { PoMaterial, PurchaseOrder } from "src/app/shared/models/PO/po-data";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { ignoreElements, debounceTime } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "app-po-table",
  templateUrl: "./po-table.component.html",
  styleUrls: ["./po-table.component.scss"]
})
export class PoTableComponent implements OnInit, OnDestroy {
  @Input("poTableData") poTableData: PoMaterial[];
  @Input("viewMode") viewMode: boolean;
  gst: string;
  constructor(private formBuilder: FormBuilder) {}
  poForms: FormGroup;
  subscriptions: Subscription[] = [];
  ngOnInit() {
    this.formInit();
  }
  formInit() {
    const frmArr: FormGroup[] = this.poTableData.map(
      (poMaterial: PoMaterial) => {
        let purchaseGrp: FormGroup[] = poMaterial.purchaseOrderDetailList.map(
          (purchaseoder: PurchaseOrder) => {
            const frmGrp: FormGroup = this.formBuilder.group({
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
              gst: [],
              gstTotal: [],
              total: [{ value: "", disabled: false }]
            });
            this.subscriptions.push(
              frmGrp.valueChanges.pipe(debounceTime(200)).subscribe(formVal => {
                const gstCalc =
                  formVal.materialQuantity *
                  formVal.materialUnitPrice *
                  (formVal.gst / 100);
                const calc =
                  formVal.materialQuantity * formVal.materialUnitPrice +
                  gstCalc;

                frmGrp.get("total").setValue(calc);
                frmGrp.get("gstTotal").setValue(gstCalc);
              })
            );

            return frmGrp;
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

  get totalAmount(): number {
    return this.poForms
      .getRawValue()
      .forms.map(frm => frm.purchaseOrderDetailList)
      .flat()
      .map(mat => mat.total)
      .reduce((a, b) => a + b);
  }

  get gstTotalAmount() {
    return this.poForms
      .getRawValue()
      .forms.map(frm => frm.purchaseOrderDetailList)
      .flat()
      .map(mat => mat.gstTotal)
      .reduce((a, b) => a + b);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }
  sumbit() {
    this.getData();
    console.log(this.poForms.value.forms);
  }

  getData(): PoMaterial[] {
    return this.poForms.value.forms.map(material => {
      material.purchaseOrderDetailList.map(purchaseOrderList => {
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
}
