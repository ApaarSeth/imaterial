import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SendRfqObj } from "src/app/shared/models/RFQ/rfq-details-supplier";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { MatDialog } from "@angular/material";
import { ConfirmRfqBidComponent } from "src/app/shared/dialogs/confirm-rfq-bid/confirm-frq-bid-component";
@Component({
  selector: "rfq-indent-detail",
  templateUrl: "./rfq-supplier-detail.component.html"
})
export class RFQSupplierDetailComponent implements OnInit {
  rfqSupplierDetailList: SendRfqObj;
  dudateFlag: boolean = false;
  projectCount: number = 0;
  materialCount: number = 0;
  brandCount: number = 0;

  defaultTaxBtn: string = "IGST";
  materialIGSTFlag: boolean = false;
  brandRateFlag: boolean = false;
  submitButtonValidationFlag: boolean = false;
  gstAndBrandValue: boolean = false;
  sameGstAndBrandFilled: boolean = false;
  materialIndividualIGSTFlag: boolean = false;
  eitherOneGstOrBrand: boolean;
  dateDue: string = "";
  brandNotMatchedCount: number = 0;
  oneBrandAtMaterialSelected: boolean;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private router: Router
  ) {}

  ngOnInit() {
    this.rfqService
      .getRFQDetailSupplier(
        this.activatedRoute.snapshot.params["rfqId"],
        this.activatedRoute.snapshot.params["supplierId"]
      )
      .then(data => {
        this.rfqSupplierDetailList = data.data;
        if (this.rfqSupplierDetailList.projectList) {
          this.rfqSupplierDetailList.projectList.forEach(element => {
            this.materialCount =
              this.materialCount + element.materialList.length;
            if (
              element.gst == null ||
              element.gst == undefined ||
              element.gst == ""
            ) {
              element.gst = "IGST";
            }
          });
        }
      });
  }

  postRFQDetailSupplier(rfqSupplierObj) {
    this.openDialog(rfqSupplierObj);
  }

  submitBid(rfqSupplierObj) {
    this.rfqService
      .postRFQDetailSupplier(
        this.activatedRoute.snapshot.params["supplierId"],
        rfqSupplierObj
      )
      .then(res => {
        res.data;
        this.router.navigate([
          "rfq-bids/after-submit/" + this.brandCount + "/" + this.materialCount
        ]);
      });
  }

  openDialog(rfqSupplierObj): void {
    const dialogRef = this.dialog.open(ConfirmRfqBidComponent, {
      width: "800px"
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(data => {
        if (data.data == "close") {
          console.log("The dialog was closed");
        }
        if (data.data == "submit") {
          this.submitBid(rfqSupplierObj);
          console.log("The dialog was submitted");
        }
      });
  }

  radioChange(event, projects) {
    projects.gst = event.value;
    console.log(this.rfqSupplierDetailList);
  }
  duedatefunc(event) {
    this.dateDue = event.target.value;
    if (this.dateDue != "" && this.dateDue != null) {
      this.dudateFlag = true;
    } else if (this.dateDue == "" || this.dateDue == null) {
      this.dudateFlag = false;
      this.submitButtonValidationFlag = false;
    }

    if (
      this.dudateFlag &&
      this.sameGstAndBrandFilled &&
      !this.eitherOneGstOrBrand
    ) {
      this.submitButtonValidationFlag = true;
    } else {
      this.submitButtonValidationFlag = false;
    }
  }
  valueChange(RFQsupplier: SendRfqObj) {
    this.submitButtonValidationFlag = false;
    this.brandRateFlag = false;
    this.materialIGSTFlag = false;
    this.sameGstAndBrandFilled = false;
    this.eitherOneGstOrBrand = false;
    this.dudateFlag = false;

    this.brandCount = 0;
    this.oneBrandAtMaterialSelected = false;
    if (RFQsupplier.dueDate) {
      this.dudateFlag = true;
    }
    for (let project of RFQsupplier.projectList) {
      this.projectCount++;
      for (let material of project.materialList) {
        material.materialSgst = 0;
        material.materialCgst = 0;
        if (project.gst == "IGST") {
          material.materialIgst = material.materialIgst;
        } else if (project.gst == "CGST-SGST") {
          material.materialSgst = material.materialIgst / 2;
          material.materialCgst = material.materialIgst / 2;
        }
        if (material.materialIgst) {
          material.materialIGSTFlag = true;
          this.materialIGSTFlag = material.materialIGSTFlag;
          this.materialIndividualIGSTFlag = material.materialIGSTFlag;
        }
        for (let brand of material.rfqBrandList) {
          if (brand.brandRate) {
            brand.brandRateFlag = true;
            this.brandRateFlag = brand.brandRateFlag;
            this.oneBrandAtMaterialSelected = brand.brandRateFlag;
          }
          if (this.materialIndividualIGSTFlag && this.brandRateFlag) {
            this.sameGstAndBrandFilled = true;
          } else if (this.materialIndividualIGSTFlag && !this.brandRateFlag) {
            this.brandNotMatchedCount++;
            this.sameGstAndBrandFilled = false;
            this.eitherOneGstOrBrand = true;
          } else if (!this.materialIndividualIGSTFlag && this.brandRateFlag) {
            this.brandNotMatchedCount++;
            this.sameGstAndBrandFilled = false;
            this.eitherOneGstOrBrand = true;
          }
        }
        if (this.brandRateFlag && this.materialIndividualIGSTFlag) {
          this.gstAndBrandValue = true;
          this.materialIndividualIGSTFlag = false;
          this.brandRateFlag = false;
        } else {
          this.gstAndBrandValue = false;
          this.brandRateFlag = false;
          this.materialIGSTFlag = false;
          this.materialIndividualIGSTFlag = false;
        }
        if (this.oneBrandAtMaterialSelected) {
          this.brandCount++;
          this.oneBrandAtMaterialSelected = false;
        }
      }
    }
    if (
      this.dudateFlag &&
      this.sameGstAndBrandFilled &&
      !this.eitherOneGstOrBrand
    ) {
      this.submitButtonValidationFlag = true;
    }
  }
}
