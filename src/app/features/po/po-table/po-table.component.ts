import { Component, OnInit, Input, OnDestroy, ViewChild } from "@angular/core";
import { PoMaterial, PurchaseOrder } from "src/app/shared/models/PO/po-data";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { ignoreElements, debounceTime } from "rxjs/operators";
import { Subscription } from "rxjs";

@Component({
  selector: "app-po-table",
  templateUrl: "./po-table.component.html"
})
export class PoTableComponent implements OnInit, OnDestroy {
  @Input("poTableData") poTableData: PoMaterial[];
  @Input("mode") mode: string;
  gst: string;
  constructor(private formBuilder: FormBuilder) {}
  poForms: FormGroup;
  subscriptions: Subscription[] = [];
  ngOnInit() {
    this.formInit();
    console.log(this.poTableData);
  }
  formInit() {
    const frmArr: FormGroup[] = this.poTableData.map(
      (poMaterial: PoMaterial, i) => {
        let purchaseGrp: FormGroup[] = poMaterial.purchaseOrderDetailList.map(
          (purchaseorder: PurchaseOrder, j) => {
            const frmGrp: FormGroup = this.formBuilder.group({
              id: [purchaseorder.materialId],
              status: [purchaseorder.status],
              created_by: [purchaseorder.created_by],
              created_at: [purchaseorder.created_at],
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
              materialUnit: [purchaseorder.materialUnit],
              materialUnitPrice: [purchaseorder.materialUnitPrice],
              materialIgst: [1],
              materialSgst: [2],
              materialCgst: [],
              amount: [],
              gstAmount: [],
              gst: [],
              gstTotal: [],
              total: [{ value: "", disabled: false }]
            });
            this.subscriptions.push(
              frmGrp.valueChanges.pipe(debounceTime(200)).subscribe(formVal => {
                this.poTableData[i].purchaseOrderDetailList[j].qty =
                  formVal.materialQuantity;
                const amount =
                  formVal.materialQuantity * formVal.materialUnitPrice;
                const gstCalc =
                  formVal.materialQuantity *
                  formVal.materialUnitPrice *
                  (formVal.gst / 100);
                const calc = amount + gstCalc;
                this.poTableData[i].purchaseOrderDetailList[j].amount = amount;
                this.poTableData[i].purchaseOrderDetailList[
                  j
                ].gstAmount = gstCalc;
                this.poTableData[i].purchaseOrderDetailList[j].total = calc;
                frmGrp.get("amount").setValue(amount);
                frmGrp.get("total").setValue(calc);
                frmGrp.get("gstAmount").setValue(gstCalc);
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
  }

  get totalAmount(): number {
    let sum: number = 0;
    if (this.mode === "edit") {
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
      return sum;
    }
  }

  get gstTotalAmount() {
    let sum = 0;
    if (this.mode === "edit") {
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

  getMaterialQuantity(m) {
    if (this.mode != "edit") {
      return this.poTableData[m].purchaseOrderDetailList.reduce(
        (total, purchase: PurchaseOrder) => {
          return (total += purchase.materialQuantity);
        },
        0
      );
    } else {
      return this.poTableData[m].purchaseOrderDetailList.reduce(
        (total, purchase: PurchaseOrder) => {
          return (total += purchase.qty);
        },
        0
      );
    }
  }
  getMaterialAmount(m) {
    if (this.mode != "edit") {
      return this.poTableData[m].purchaseOrderDetailList.reduce(
        (total, purchase: PurchaseOrder) => {
          return (total += purchase.amount);
        },
        0
      );
    } else {
      return this.poTableData[m].purchaseOrderDetailList.reduce(
        (total, purchase: PurchaseOrder) => {
          return (total += purchase.amount);
        },
        0
      );
    }
  }
  getMaterialGstAmount(m) {
    if (this.mode != "edit") {
      return this.poTableData[m].purchaseOrderDetailList.reduce(
        (total, purchase: PurchaseOrder) => {
          return (total += purchase.gstAmount);
        },
        0
      );
    } else {
      return this.poTableData[m].purchaseOrderDetailList.reduce(
        (total, purchase: PurchaseOrder) => {
          return (total += purchase.gstAmount);
        },
        0
      );
    }
  }
  getMaterialTotalAmount(m) {
    if (this.mode != "edit") {
      return this.poTableData[m].purchaseOrderDetailList.reduce(
        (total, purchase: PurchaseOrder) => {
          return (total += purchase.total);
        },
        0
      );
    } else {
      return this.poTableData[m].purchaseOrderDetailList.reduce(
        (total, purchase: PurchaseOrder) => {
          return (total += purchase.total);
        },
        0
      );
    }
  }
}
