import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "rfq-indent-detail",
  templateUrl: "./rfq-supplier-detail.component.html",
  styleUrls: [
    "../../../../assets/scss/main.scss",
    "../../../../assets/scss/pages/rfq-bids.component.scss"
  ]
})
export class RFQSupplierDetailComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    console.log(
      "dsfhj",
      this.activatedRoute.snapshot.data.rfqSupplierDetailResolver
    );
    //   this.checkedMaterialsList = history.state.checkedMaterials;
    //   console.log("projectList", this.checkedMaterialsList);
    //   if (this.checkedMaterialsList) {
    //     this.formsInit();
    //   }
    // }
  }
}
