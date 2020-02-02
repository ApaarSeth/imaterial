import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PODetailLists } from "src/app/shared/models/po-details/po-details-list";

@Component({
  selector: "po-detail-list",
  templateUrl: "./po-detail-list.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class PODetailComponent implements OnInit {
  poDetails: PODetailLists;

  displayedColumns = [
    "PO Name",
    "Raised Date",
    "Total Material",
    "PO Amount",
    "ViewPo"
  ];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.poDetails = this.activatedRoute.snapshot.data.poDetailList;
    console.log("poDetails", this.poDetails);
  }
}
