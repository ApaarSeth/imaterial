import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SendRfqObj } from "src/app/shared/models/RFQ/rfq-details-supplier";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ConfirmRfqBidComponent } from "src/app/shared/dialogs/confirm-rfq-bid/confirm-frq-bid-component";
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { materialize } from 'rxjs/operators';
import { formatDate, DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Froala } from 'src/app/shared/constants/configuration-constants';
import { DocumentList, ImageList, ImageDocsLists } from 'src/app/shared/models/PO/po-data';
import { DocumentUploadService } from 'src/app/shared/services/document-download/document-download.service';
import { RFQDocumentsComponent } from '../rfq-bid-documents/rfq-bid-documents.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TaxCostComponent } from 'src/app/shared/dialogs/tax-cost/tax-cost.component';
import { OtherCostInfo } from 'src/app/shared/models/tax-cost.model';
import { UploadImageComponent } from 'src/app/shared/dialogs/upload-image/upload-image.component';
import { ViewImageComponent } from 'src/app/shared/dialogs/view-image/view-image.component';

interface prevTaxCost {
  dt: any;
  pId?: number;
  mId?: number;
}

@Component({
  selector: "rfq-indent-detail",
  templateUrl: "./rfq-supplier-detail.component.html"
})
export class RFQSupplierDetailComponent implements OnInit {

  @Input("documentListLength") public documentListLength: number;
  @Input("documentData") documentData: DocumentList[];
  @ViewChild("rfqDocument", { static: false }) rfqDocument: RFQDocumentsComponent;
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
  gstValid: boolean;
  ALLVALID: boolean;
  eitherOneValidInMaterial: boolean;
  showDateError: string;
  endstring: string;
  rfqTerms: FormGroup;
  docs: FileList;
  filesRemoved: boolean;
  documentList: DocumentList[] = [];
  documentsName: string[] = [];
  taxAndCostData: any = {};
  otherCostData: any = {};

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private documentUploadService: DocumentUploadService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }

  public froala: Object = {
    placeholder: "Edit Me",
    imageUpload: false,
    imageBrowse: false,
    key: Froala.key
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '9rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [ 'backgroundColor', 'insertImage', 'insertVideo', 'strikeThrough', 'justifyLeft', 'justifyRight', 'justifyCenter', 'justifyFull', 'indent', 'outdent', 'htmlcode', 'link', 'unlink', 'toggleEditorMode', 'subscript', 'superscript' ]
    ],

  };


  ngOnInit() {
    this.rfqService
      .getRFQDetailSupplier(
        this.activatedRoute.snapshot.params[ "rfqId" ],
        this.activatedRoute.snapshot.params[ "supplierId" ]
      )
      .then(data => {
        if (data.data.rfqSupplierBidFlag === 1) {
          this.router.navigate([ '/rfq-bids/finish' ]);
        }
        this.rfqSupplierDetailList = data.data;
        localStorage.setItem('isInternational', JSON.stringify(this.rfqSupplierDetailList.isInternational));
        if (this.rfqSupplierDetailList.projectList) {
          this.rfqSupplierDetailList.projectList.forEach(element => {
            this.materialCount =
              this.materialCount + element.materialList.length;

            if (this.rfqSupplierDetailList.isInternational === 0) {
              if (
                element.gst == null ||
                element.gst == undefined ||
                element.gst == ""
              ) {
                element.gst = "IGST";
              }
            }

          });
        }
        for (let project of this.rfqSupplierDetailList.projectList) {
          for (let material of project.materialList) {

            if (this.rfqSupplierDetailList.isInternational === 0) {
              material.validGst = true;
              if (material.materialIgst == 0) {
                material.Igst = material.materialCgst + material.materialSgst;
                if (material.Igst == 0)
                  material.Igst = null
              }
              else {
                material.Igst = material.materialIgst;
                if (material.Igst == 0)
                  material.Igst = null
              }
            }

            for (let brand of material.rfqBrandList) {
              brand.validBrand = true;
              if (brand.brandRate == 0) {
                brand.tempRate = null;
              }
              else {
                brand.brandRate = brand.tempRate;
              }
            }
          }
        }
      });
    this.formInit();
  }

  postRFQDetailSupplier(rfqSupplierObj) {

    rfqSupplierObj.projectList.forEach(project => {
      project.materialList.forEach(mat => {
        mat.documentsList = mat.documentsList.filter(doc => doc.supplierId !== null) 
      })
    });
    
    if (this.rfqSupplierDetailList.isInternational === 1) {
      rfqSupplierObj.projectList.forEach(itm => {
        if (this.taxAndCostData.hasOwnProperty(itm.projectId)) {
          itm = this.updateItemTaxInfo(itm);
        }
      });
      if (Object.keys(this.otherCostData).length && this.otherCostData.hasOwnProperty('otherCostInfo')) {
        rfqSupplierObj.otherCostRfqList = this.otherCostData[ 'otherCostInfo' ];
      }

      this.submitBidInternational(rfqSupplierObj);
    } else {
      this.submitBid(rfqSupplierObj);
    }
  }

  updateItemTaxInfo(item) {
    item.materialList.forEach(itm => {
      if (this.taxAndCostData[ item.projectId ].hasOwnProperty(itm.materialId)) {
        itm.taxInfo = this.taxAndCostData[ item.projectId ][ itm.materialId ] !== null ? this.taxAndCostData[ item.projectId ][ itm.materialId ].taxInfo : [];
        itm.otherCostInfo = this.taxAndCostData[ item.projectId ][ itm.materialId ] !== null ? this.taxAndCostData[ item.projectId ][ itm.materialId ].otherCostInfo : [];
      }
    });
    return item;
  }

  submitBid(rfqSupplierObj) {
    rfqSupplierObj.projectList = rfqSupplierObj.projectList.map(rfqSupplier => {
      rfqSupplier.materialList.map(material => {
        material.materialGst = Number(material.materialGst);
        material.materialIgst = Number(material.materialIgst);
        material.Igst = Number(material.Igst);
        material.rfqBrandList.map(brand => {
          brand.brandRate = Number(brand.brandRate);
          brand.tempRate = Number(brand.tempRate);
          return brand
        })
        return material;
      })
      return rfqSupplier;
    })
    rfqSupplierObj.dueDate = rfqSupplierObj.quoteValidTill;
    rfqSupplierObj.comments = this.rfqTerms.value[ 'textArea' ];
    let supplierId = this.activatedRoute.snapshot.params[ "supplierId" ];
    let rfqId = Number(this.activatedRoute.snapshot.params[ "rfqId" ]);
    rfqSupplierObj.rfqId = rfqId;
    rfqSupplierObj.DocumentsList = this.rfqDocument.getData();
    this.router.navigate([
      "rfq-bids/add-address/" + this.brandCount + "/" + this.materialCount
    ], { state: { supplierId, rfqSupplierObj } });

  }

  submitBidInternational(rfqSupplierObj) {
    rfqSupplierObj.projectList = rfqSupplierObj.projectList.map(rfqSupplier => {
      rfqSupplier.materialList.map(material => {
        material.rfqBrandList.map(brand => {
          brand.brandRate = Number(brand.brandRate);
          brand.tempRate = Number(brand.tempRate);
          return brand
        })
        return material;
      })
      return rfqSupplier;
    })
    rfqSupplierObj.dueDate = rfqSupplierObj.quoteValidTill;
    rfqSupplierObj.comments = this.rfqTerms.value[ 'textArea' ];
    let supplierId = this.activatedRoute.snapshot.params[ "supplierId" ];
    let rfqId = Number(this.activatedRoute.snapshot.params[ "rfqId" ]);
    rfqSupplierObj.rfqId = rfqId;
    rfqSupplierObj.DocumentsList = this.rfqDocument.getData();
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
        material.materialIgst = 0;
      }
    }
  }

  duedatefunc(event, value) {

    this.dateDue = event.target.value;
    const datePipe = new DatePipe('en-US');
    const setDob = datePipe.transform(this.rfqSupplierDetailList.dueDate, 'dd-MMM-yyy');

    if (this.dateDue != "" && this.dateDue != null) {
      if (value == setDob) {
        this.showDateError = "Quote Valid Till must be greater than RFQ Expiry Date";
        this.dudateFlag = false;
      }
      else {
        this.showDateError = null;
        this.dudateFlag = true;
      }
    } else if (this.dateDue == "" || this.dateDue == null) {
      this.dudateFlag = false;
      this.submitButtonValidationFlag = false;
    }

    if (this.rfqSupplierDetailList.isInternational === 0) {
      if (this.dudateFlag && this.sameGstAndBrandFilled && !this.eitherOneGstOrBrand) {
        this.submitButtonValidationFlag = true;
      } else {
        this.submitButtonValidationFlag = false;
      }
    } else {
      if (this.dudateFlag && this.eitherOneValidInMaterial) {
        this.submitButtonValidationFlag = true;
      } else {
        this.submitButtonValidationFlag = false;
      }
    }
  }

  formInit() {
    this.rfqTerms = this.formBuilder.group({
      textArea: []
    })
  }

  valueChange(RFQsupplier: SendRfqObj) {
    this.submitButtonValidationFlag = false;
    this.brandRateFlag = false;
    this.materialIGSTFlag = false;
    this.sameGstAndBrandFilled = false;
    this.eitherOneGstOrBrand = false;
    this.eitherOneValidInMaterial = false;
    this.dudateFlag = false;

    this.brandCount = 0;
    this.oneBrandAtMaterialSelected = false;
    if (RFQsupplier.quoteValidTill) {
      if (this.showDateError != null)
        this.dudateFlag = false;
      else
        this.dudateFlag = true;
    }
    for (let project of RFQsupplier.projectList) {

      this.projectCount++;

      for (let material of project.materialList) {

        // material.materialSgst = 0;
        // material.materialCgst = 0;

        if (this.rfqSupplierDetailList.isInternational === 0) {
          material.materialIgst = material.Igst;
          if (project.gst == "IGST") {
            material.materialIgst = material.materialIgst;
            material.materialSgst = 0;
            material.materialCgst = 0;

          } else if (project.gst == "CGST-SGST") {
            material.materialGst = material.materialIgst;
            material.materialSgst = material.materialGst / 2;
            material.materialCgst = material.materialGst / 2;
            material.materialIgst = 0;
          }
          if (material.Igst != null && material.Igst.toString() == '') {
            material.Igst = null;
          }
          if (material.Igst >= 0 && material.Igst != null) {
            if (material.Igst.toString().match(FieldRegExConst.RATES)) {
              material.validGst = true;
              this.gstValid = true;
            }
            else {
              material.validGst = false;
              this.gstValid = false;
            }
            material.materialIGSTFlag = true;
            this.materialIGSTFlag = material.materialIGSTFlag;
            this.materialIndividualIGSTFlag = material.materialIGSTFlag;
          }
        } else {
          this.materialIndividualIGSTFlag = true;
        }


        for (let brand of material.rfqBrandList) {
          brand.brandRate = brand.tempRate;
          if (brand.brandRate != null && brand.brandRate.toString() == '') {
            brand.brandRate = null;
          }
          if (brand.brandRate >= 0 && brand.brandRate != null) {
            if (brand.brandRate.toString().match(FieldRegExConst.RATES)) {
              brand.validBrand = true;
              this.rateValid = true;
            }
            else {
              brand.validBrand = false;
              this.rateValid = false;
            }
            brand.brandRateFlag = true;
            this.brandRateFlag = brand.brandRateFlag;
            this.oneBrandAtMaterialSelected = brand.brandRateFlag;
          }

          if ((brand == material.rfqBrandList[ material.rfqBrandList.length - 1 ])) {

            if (this.rfqSupplierDetailList.isInternational === 0) {

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
              if (this.gstValid && this.rateValid) {
                this.ALLVALID = true;
              }
              else if (!this.gstValid || !this.rateValid) {
                this.ALLVALID = false;
                this.eitherOneValidInMaterial = true;
              }

            } else {

              if (this.brandRateFlag) {
                this.ALLVALID = true;
                this.eitherOneValidInMaterial = true;
              }

            }

          }
        }

        if (this.brandRateFlag && this.materialIndividualIGSTFlag) {
          this.gstAndBrandValue = true;
          if (this.rfqSupplierDetailList.isInternational === 0) {
            this.materialIndividualIGSTFlag = false;
          }
          this.brandRateFlag = false;

        } else {
          this.gstAndBrandValue = false;
          this.brandRateFlag = false;
          this.materialIGSTFlag = false;
          if (this.rfqSupplierDetailList.isInternational === 0) {
            this.materialIndividualIGSTFlag = false;
          }
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
      !this.eitherOneGstOrBrand && this.ALLVALID && !this.eitherOneValidInMaterial
    ) {
      this.submitButtonValidationFlag = true;
    } else {
      if (this.rfqSupplierDetailList.isInternational === 1) {

        if (this.dudateFlag && this.eitherOneValidInMaterial) {
          this.submitButtonValidationFlag = true;
        } else {
          this.submitButtonValidationFlag = false;
        }
      }
    }

  }

  // taking tax and cost on item and on total item using dialog
  openTaxesCostsDialog(type: string, pId?: number, mId?: number) {
    let prevData;
    if (type === 'taxesAndCost') {
      prevData = {
        dt: this.taxAndCostData,
        pId: pId,
        mId: mId
      } as prevTaxCost;
    }
    if (type === 'otherCost') {
      prevData = {
        dt: this.otherCostData,
      } as prevTaxCost;
    }
    const dialogRef = this.dialog.open(TaxCostComponent, {
      width: "600px",
      data: {
        type,
        rfqId: Number(this.activatedRoute.snapshot.params[ "rfqId" ]),
        prevData
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (type === 'taxesAndCost') {
        if (!this.taxAndCostData.hasOwnProperty(pId)) {
          this.taxAndCostData[ pId ] = {};
        }
        this.taxAndCostData[ pId ][ mId ] = res;
      }
      if (type === 'otherCost') {
        this.otherCostData = res;
      }
    });
  }

  // getting taxInfo total in ui
  getTaxInfototal(data: any[]) {
    let itmData = [];
    data.forEach(itm => {
      itmData.push(itm.taxValue);
    });
    return (itmData.reduce(this.getSum) / 100);
  }

  // getting other cost info total in ui
  getotherCostInfoTotal(data: any[]) {
    let itmData = [];
    data.forEach(itm => {
      itmData.push(itm.otherCostAmount);
    });
    return itmData.reduce(this.getSum);
  }
  getSum(total, num) {
    return total + num;
  }

  uploadImage(selectedMaterial, type) {

    let prevUploadedImageList: any;
    this.rfqSupplierDetailList.projectList.forEach(project => {
      project.materialList.forEach(mat => {
        if(selectedMaterial.materialId === mat.materialId){
          prevUploadedImageList = mat;
        }
      })
    });

    console.log(prevUploadedImageList);

    const dialogRef = this.dialog.open(UploadImageComponent, {
      disableClose: true,
      width: "60vw",
      panelClass: 'upload-image-modal',
      data: {
        selectedMaterial,
        type,
        rfqId: this.activatedRoute.snapshot.params["rfqId"],
        supplierId: this.activatedRoute.snapshot.params["supplierId"],
        prevUploadedImages: prevUploadedImageList ? prevUploadedImageList : []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        
        const matId = result.map(mat => mat.materialId).filter((value, index, self) => self.indexOf(value) === index);

        this.rfqSupplierDetailList.projectList.map(project => {
          project.materialList.map(mat => {
            if(mat.materialId === matId[0]){
              // mat.documentsList = result.filter(material => material.supplierId);
              mat.documentsList = result;
            }
          })
        });
      }
    });
  }

  /**
   * function will call to open view image modal
   * @param rfqId, materialId, type
   */
  viewAllImages(materialId) {

    let allSupplierImages: any;
    this.rfqSupplierDetailList.projectList.forEach(project => {
      project.materialList.forEach(mat => {
        if(materialId === mat.materialId){
          allSupplierImages = mat;
        }
      })
    });

    const dialogRef = this.dialog.open(ViewImageComponent, {
      disableClose: true,
      width: "500px",
      panelClass: 'view-image-modal',
      data: {
        rfqId: this.activatedRoute.snapshot.params["rfqId"],
        materialId,
        type: 'supplier',
        displayImages: allSupplierImages
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

}