import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { POService } from "src/app/shared/services/po/po.service";
import {
  POData,
  PoMaterial,
  CardData,
  poApproveReject
} from "src/app/shared/models/PO/po-data";
import { PoTableComponent } from "./po-table/po-table.component";
import { PoCardComponent } from "./po-card/po-card.component";
import { MatDialog } from "@angular/material";
import { SelectApproverComponent } from "src/app/shared/dialogs/selectPoApprover/selectPo.component";
import { PoDocumentsComponent } from "./po-documents/po-documents.component";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-po",
  templateUrl: "./po.component.html",
  styleUrls: [
    "/../../../assets/scss/main.scss",
    "/../../../assets/scss/pages/po.component.scss"
  ]
})
export class PoComponent implements OnInit {
  poData: POData = {} as POData;
  tableData: PoMaterial[] = [];
  cardData: CardData;
  viewMode = false;
  collatePoData = {} as poApproveReject;
  @ViewChild("poTable", { static: false }) poTable: PoTableComponent;
  @ViewChild("poCard", { static: false }) poCard: PoCardComponent;
  @ViewChild("poDocument", { static: false }) poDocument: PoDocumentsComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private poService: POService
  ) {}
  poId: number;
  poMode: string;
  ngOnInit() {
    this.route.params.subscribe(poParams => {
      this.poId = Number(poParams.id);
      this.poMode = poParams.mode;
    });
    this.poService.getPoGenerateData(this.poId).then(res => {
      this.poData = res.data;
      console.log(this.poData);
      this.tableData = this.poData.materialData;
      this.cardData = {
        supplierAddress: this.poData.supplierAddress,
        projectAddress: this.poData.projectAddress,
        billingAddress: this.poData.billingAddress,
        poNumber: this.poData.poNumber,
        poValidUpto: this.poData.poValidUpto,
        projectId: this.poData.projectId
      };
    });
  }
  collateResults() {
    console.log("podocument", this.poDocument.getData());
    let poDataCollate: POData = {
      supplierAddress: this.poData.supplierAddress,
      projectAddress: this.poData.projectAddress,
      billingAddress: this.poData.billingAddress,
      materialData: this.poTable.getData() as PoMaterial[],
      purchaseOrderDetailId: 0,
      purchaseOrderId: this.poId,
      poNumber: this.poCard.getData().orderNo,
      poName: "",
      poValidUpto: this.poCard.getData().endDate,
      DocumentsList: this.poDocument.getData(),
      Terms: {
        termsDesc: "All test In it, Please add the terms test here only",
        termsType: "RFQ"
      },
      comments: "good",
      projectId: this.poData.projectId
    };
    return poDataCollate;
  }
  viewModes() {
    this.viewMode = true;
  }
  selectApprover() {
    this.viewMode = true;
    let data: POData = this.collateResults();
    this.openDialog(data);
  }
  openDialog(data: POData) {
    const dialogRef = this.dialog.open(SelectApproverComponent, {
      width: "700px",
      height: "500px",
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("result", result);
      this.poService.sendPoData(result).then(res => {
        if (res.status === 1) {
          this.router.navigate(["po/detail-list"]);
        }
      });

      console.log("The dialog was closed");
    });
  }
  poApproval(decision) {
    this.collatePoData.poApproverId = this.poData.approverId;
    this.collatePoData.purchaseOrderId = this.poData.purchaseOrderId;
    this.collatePoData.userId = Number(localStorage.getItem("userId"));
    if (decision === "approved") {
      this.collatePoData.isApproved = 1;
    } else {
      this.collatePoData.isApproved = 0;
    }
    this.poService.approveRejectPo(this.collatePoData);
  }
}
