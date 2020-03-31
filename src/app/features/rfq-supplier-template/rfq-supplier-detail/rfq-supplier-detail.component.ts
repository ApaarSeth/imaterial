import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SendRfqObj } from "src/app/shared/models/RFQ/rfq-details-supplier";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { MatDialog } from "@angular/material";
import { ConfirmRfqBidComponent } from "src/app/shared/dialogs/confirm-rfq-bid/confirm-frq-bid-component";
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
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
  minDate = new Date();
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
  dotCount: any;
  rateValid: boolean;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private router: Router
  ) { }

  ngOnInit() {
    this.rfqService
      .getRFQDetailSupplier(
        this.activatedRoute.snapshot.params["rfqId"],
        this.activatedRoute.snapshot.params["supplierId"]
      )
      .then(data => {

        if (data.data.rfqSupplierBidFlag === 1) {
          this.router.navigate(['/rfq-bids/finish']);
        }

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

         for (let project of this.rfqSupplierDetailList.projectList) {
              for (let material of project.materialList) {
                if(material.materialIgst == 0){
                  material.Igst = null;
                }
                else{
                   material.Igst = material.materialIgst;
                }
                 for (let brand of material.rfqBrandList) {
                      if(brand.brandRate == 0){
                          brand.tempRate = null;
                      }
                      else{
                       brand.brandRate = brand.tempRate;
                      }
                 }
              }
            }

      });
  }

  postRFQDetailSupplier(rfqSupplierObj) {
    this.submitBid(rfqSupplierObj);
  }

  submitBid(rfqSupplierObj) {
    rfqSupplierObj.dueDate = rfqSupplierObj.quoteValidTill;
    let supplierId = this.activatedRoute.snapshot.params["supplierId"];
    let rfqId = Number(this.activatedRoute.snapshot.params["rfqId"]);
    rfqSupplierObj.rfqId = rfqId;
    this.router.navigate([
      "rfq-bids/add-address/" + this.brandCount + "/" + this.materialCount
    ], { state: { supplierId, rfqSupplierObj } });

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
        }
        if (data.data == "submit") {
          this.submitBid(rfqSupplierObj);
        }
      });
  }

  radioChange(event, project) {
    project.gst = event.value;

      for (let material of project.materialList) {
        material.materialIgst = material.Igst;
        if (project.gst == "IGST") {
          material.materialIgst = material.materialIgst;
          material.materialSgst = 0;
          material.materialCgst = 0;

        } else if (project.gst == "CGST-SGST") {
          material.materialGst = material.materialIgst;
          material.materialSgst = material.materialGst / 2;
          material.materialCgst = material.materialGst / 2;
         // material.materialIgst = 0;
        }
      }
  }

  duedatefunc(event) {

    this.dateDue = event.target.value;

    if (this.dateDue != "" && this.dateDue != null) {
      this.dudateFlag = true;
    } else if (this.dateDue == "" || this.dateDue == null) {
      this.dudateFlag = false;
      this.submitButtonValidationFlag = false;
    }

    if (this.dudateFlag && this.sameGstAndBrandFilled && !this.eitherOneGstOrBrand) {
      this.submitButtonValidationFlag = true;
    } else {
      this.submitButtonValidationFlag = false;
    }
  }

  valueChange(RFQsupplier: SendRfqObj,event) {
  
  //  if(event.target.value.length>0 && event.target.value.match(FieldRegExConst.RATES)){
  //    if((event.charCode > 47 && event.charCode < 58) || event.charCode == 46){
  //                         this.rateValid = true
  //                      }
  //   }
  //   else {
  //     this.rateValid = false;
  //   }
     

    this.submitButtonValidationFlag = false;
    this.brandRateFlag = false;
    this.materialIGSTFlag = false;
    this.sameGstAndBrandFilled = false;
    this.eitherOneGstOrBrand = false;
    this.dudateFlag = false;

    this.brandCount = 0;
    this.oneBrandAtMaterialSelected = false;
    if (RFQsupplier.quoteValidTill) {
      this.dudateFlag = true;
    }
    for (let project of RFQsupplier.projectList) {

      this.projectCount++;

      for (let material of project.materialList) {

        // material.materialSgst = 0;
        // material.materialCgst = 0;
        material.materialIgst = material.Igst;
        if (project.gst == "IGST") {
          material.materialIgst = material.materialIgst;
          material.materialSgst = 0;
          material.materialCgst = 0;

        } else if (project.gst == "CGST-SGST") {
          material.materialGst = material.materialIgst;
          material.materialSgst = material.materialGst / 2;
          material.materialCgst = material.materialGst / 2;
          //material.materialIgst = 0;
        }
        if (material.materialIgst >= 0 &&  material.materialIgst!=null) {
          material.materialIGSTFlag = true;
          this.materialIGSTFlag = material.materialIGSTFlag;
          this.materialIndividualIGSTFlag = material.materialIGSTFlag;
        }

        
        for (let brand of material.rfqBrandList) {
          brand.brandRate = brand.tempRate;
          
          if (brand.brandRate >= 0 && brand.brandRate!=null) {
            brand.brandRateFlag = true;
            this.brandRateFlag = brand.brandRateFlag;
            this.oneBrandAtMaterialSelected = brand.brandRateFlag;
          }

  if((brand == material.rfqBrandList[material.rfqBrandList.length - 1])){
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