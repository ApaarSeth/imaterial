import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { POService } from "src/app/shared/services/po/po.service";
import { POData, PoMaterial, CardData } from "src/app/shared/models/PO/po-data";
import { PoTableComponent } from "./po-table/po-table.component";
import { PoCardComponent } from "./po-card/po-card.component";

@Component({
  selector: "app-po",
  templateUrl: "./po.component.html",
  styleUrls: ["/../../../assets/scss/main.scss"]
})
export class PoComponent implements OnInit {
  poData: POData = {} as POData;
  tableData: PoMaterial[] = [];
  cardData: CardData;
  viewMode = false;
  @ViewChild("poTable", { static: false }) poTable: PoTableComponent;
  @ViewChild("poCard", { static: false }) poCard: PoCardComponent;

  constructor(private poService: POService) {}

  ngOnInit() {
    this.poService.getPoGenerateData(9).then(res => {
      this.poData = res.data;
      console.log(this.poData);
      this.tableData = this.poData.materialData;
      this.cardData = {
        supplierAddress: this.poData.supplierAddress,
        projectAddress: this.poData.projectAddress,
        poNumber: this.poData.poNumber,
        poValidUpto: this.poData.poValidUpto
      };
    });
  }
  collateResults() {
    console.log(this.poCard.getData());
    console.log(this.poTable.getData());
    let poDataCollate = {
      supplierAddress: this.poData.supplierAddress,
      projectAddress: this.poData.projectAddress,
      materialData: this.poTable.getData(),
      purchaseOrderDetailId: 0,
      purchaseOrderId: 9,
      poNumber: this.poCard.getData().orderNo,
      poName: "",
      poValidUpto: this.poCard.getData().endDate,
      DocumentsList: [
        {
          documentType: "PO",
          documentDesc: "New Documents",
          documentUrl:
            "https://storage.googleapis.com/dev19-bs-ecom/tmp/dashboardSample.json"
        }
      ],
      Terms: {
        TermsDesc: "All test In it, Please add the terms test here only",
        TermsType: "RFQ"
      },
      comments: "good"
    };
    console.log(poDataCollate);
    this.poService.sendPoData(poDataCollate);
  }
  viewModes() {
    this.viewMode = true;
  }
}
