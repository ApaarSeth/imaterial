import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SendRfqObj } from "src/app/shared/models/RFQ/rfq-details-supplier";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";

@Component({
  selector: "rfq-indent-detail",
  templateUrl: "./rfq-supplier-detail.component.html",
  styleUrls: [
    "../../../../assets/scss/main.scss",
    "../../../../assets/scss/pages/rfq-bids.component.scss"
  ]
})
export class RFQSupplierDetailComponent implements OnInit {
  rfqSupplierDetailList: SendRfqObj;
  // validation flag
  dudateFlag: boolean = false;
  materialIGSTFlag: boolean = false;
  brandRateFlag: boolean = false;
  submitButtonValidationFlag: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService
  ) {}

  ngOnInit() {
    this.rfqService
      .getRFQDetailSupplier(
        this.activatedRoute.snapshot.params["rfqId"],
        this.activatedRoute.snapshot.params["supplierId"]
      )
      .then(data => {
        console.log("wefrgthyjhgff", data.data);
        this.rfqSupplierDetailList = data.data;
      });
    // this.rfqSupplierDetailList = this.activatedRoute.snapshot.data.rfqSupplierDetailResolver;
    console.log("dsfhj", this.rfqSupplierDetailList);
  }

  postRFQDetailSupplier(rfqSupplierObj) {
    this.rfqService.postRFQDetailSupplier(this.activatedRoute.snapshot.params["supplierId"], rfqSupplierObj).then(res => {
      res.data;
    });
  }

  valueChange(RFQsupplier: SendRfqObj) {
    // console.log("gst value", this.gst);
    this.submitButtonValidationFlag = false;
    if (RFQsupplier.dueDate) {
      this.dudateFlag = true;
    }
    for (let project of RFQsupplier.projectList) {
      for (let material of project.materialList) {
        // gst values set
        material.materialSgst = 0;
        material.materialCgst = 0;
        // console.log("sdfghj", project.gst);
        if (project.gst == "IGST") {
          material.materialIgst = material.materialIgst;
        } else if (project.gst == "CGST-SGST") {
          material.materialSgst = material.materialIgst / 2;
          material.materialCgst = material.materialIgst / 2;
        }
        // console.log("igst", material.materialIgst);
        // console.log("sgst", material.materialSgst);
        // console.log("cgst", material.materialCgst);
        // end value
        if (material.materialIgst) {
          material.materialIGSTFlag = true;
        } else {
          material.materialIGSTFlag = false;
        }
        this.materialIGSTFlag = material.materialIGSTFlag;
        // console.log("materialIGSTFlag", material.materialIGSTFlag);
        for (let brand of material.rfqBrandList) {
          if (brand.brandRate) {
            brand.brandRateFlag = true;
          } else {
            brand.brandRateFlag = false;
          }
          this.brandRateFlag = brand.brandRateFlag;
          // console.log("brandRateFlag", brand.brandRateFlag);
        }
        if (this.dudateFlag && this.materialIGSTFlag && this.brandRateFlag) {
          this.submitButtonValidationFlag = true;
        }
        // console.log(
        //   "submitButtonValidationFlag",
        //   this.submitButtonValidationFlag
        // );
      }
    }
    // console.log("dudateFlag", this.dudateFlag);
  }
}
