import { Component, OnInit, ViewChild, ViewChildren, HostListener, ChangeDetectorRef } from "@angular/core";
import { POService } from "src/app/shared/services/po/po.service";
import {
  POData,
  PoMaterial,
  CardData,
  poApproveReject,
  DocumentList,
  terms,
  DownloadData,
  PurchaseOrderCurrency
} from "src/app/shared/models/PO/po-data";
import { PoTableComponent } from "./po-table/po-table.component";
import { PoCardComponent } from "./po-card/po-card.component";
import { MatDialog, MatSnackBar } from "@angular/material";
import { SelectApproverComponent } from "src/app/shared/dialogs/selectPoApprover/selectPo.component";
import { PoDocumentsComponent } from "./po-documents/po-documents.component";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Terms } from 'src/app/shared/models/RFQ/rfq-details';
import { Froala } from 'src/app/shared/constants/configuration-constants';
import { Subscription, combineLatest } from 'rxjs';
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { CommonService } from 'src/app/shared/services/commonService';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { GSTINMissingComponent } from 'src/app/shared/dialogs/gstin-missing/gstin-missing.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { OtherCostInfo } from 'src/app/shared/models/tax-cost.model';

@Component({
  selector: "app-po",
  templateUrl: "./po.component.html",
  styleUrls: [
    "/../../../assets/scss/main.scss",
    "/../../../assets/scss/pages/po.component.scss"
  ]
})
export class PoComponent implements OnInit {
  public froala: Object = {
    placeholder: "Edit Me",
    imageUpload: false,
    imageBrowse: false,
    apiKey: Froala.key
  }
  jsonDoc = null;
  poData: POData = {} as POData;
  tableData: PoMaterial[] = [];
  cardData: CardData;
  viewMode = false;
  collatePoData = {} as poApproveReject;
  @ViewChild("poTable", { static: false }) poTable: PoTableComponent;
  @ViewChild("poCard", { static: false }) poCard: PoCardComponent;
  @ViewChild("poDocument", { static: false }) poDocument: PoDocumentsComponent;
  documentList: DocumentList[];
  terms: terms;
  subscriptions: Subscription[] = [];
  isPoValid: boolean = false;
  poTerms: FormGroup;
  isPoNumberValid: boolean = false;

  public POPreviewTour: GuidedTour = {
    tourId: 'po-preview-tour',
    useOrb: false,
    steps: [
      {
        title: 'Send for approval',
        selector: '.send-for-approval-btn',
        content: 'Click here to send the purchase order for approval .',
        orientation: Orientation.Left
      }
    ],
    skipCallback: () => {
      this.setLocalStorage()
    },
    completeCallback: () => {
      this.setLocalStorage()
    }
  };
  userId: number;
  ValidPOTemp: boolean;
  showResponsiveDesign: boolean;
  showResponsiveDesignDown: boolean;
  additionalOtherCost: { additionalOtherCostAmount: number, additionalOtherCostInfo: OtherCostInfo[] }
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '9rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['backgroundColor', 'insertImage', 'insertVideo', 'strikeThrough', 'justifyLeft', 'justifyRight', 'justifyCenter', 'justifyFull', 'indent', 'outdent', 'htmlcode', 'link', 'unlink', 'toggleEditorMode', 'subscript', 'superscript']
    ],

  };
  currency: { isInternational: number, purchaseOrderCurrency: PurchaseOrderCurrency }

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private poService: POService,
    private formBuilder: FormBuilder,
    private guidedTourService: GuidedTourService,
    private _snackBar: MatSnackBar,
    private commonService: CommonService,
    private userGuideService: UserGuideService,
    private navService: AppNavigationService
  ) {
  }
  poId: number;
  mode: string;
  ngOnInit() {
    window.dispatchEvent(new Event('resize'));

    this.route.params.subscribe(poParams => {
      this.poId = Number(poParams.id);
      this.mode = poParams.mode;
    });
    this.poService.getPoGenerateData(this.poId).then(res => {
      this.poData = res.data;
      this.tableData = this.poData.materialData;
      this.currency = { isInternational: this.poData.isInternational, purchaseOrderCurrency: this.poData.purchaseOrderCurrency }
      this.additionalOtherCost = { additionalOtherCostAmount: this.poData.additionalOtherCostAmount, additionalOtherCostInfo: this.poData.additionalOtherCostInfo }
      this.cardData = {
        supplierAddress: this.poData.supplierAddress,
        projectAddress: this.poData.projectAddress,
        billingAddress: this.poData.billingAddress,
        poNumber: this.poData.poNumber,
        poValidUpto: this.poData.poValidUpto,
        projectId: this.poData.projectId,
        isInternational: this.poData.isInternational,
        sellerPORating: this.poData.sellerPORating,
        poCreatedBy: this.poData.poCreatedBy,
        poStatus: this.poData.poStatus
      };
      this.documentList = this.poData.DocumentsList;
      this.terms = this.poData.Terms;
      this.terms && this.terms.termsDesc ? this.poTerms.get('textArea').setValue(this.terms.termsDesc) : null
      if ((localStorage.getItem('po') == "null") || (localStorage.getItem('po') == '0')) {
        setTimeout(() => {
          this.guidedTourService.startTour(this.POPreviewTour);
        }, 1000);
      }
      // if (this.poData.projectAddress.gstNo === "" || this.poData.projectAddress.gstNo === null) {
      //   this.openProjectDialog(this.poData)
      // }
      if (this.cardData.billingAddress.gstNo && this.cardData.billingAddress.gstNo.toString() == '') {
        this.openProjectDialog(this.poData)
      }
    });
    this.formInit();
    this.startSubscription();
  }

  setLocalStorage() {
    this.userId = Number(localStorage.getItem("userId"));

    const popovers = {
      "userId": this.userId,
      "moduleName": "po",
      "enableGuide": 1
    };
    this.userGuideService.sendUserGuideFlag(popovers).then(res => {
      if (res) {
        localStorage.setItem('po', '1');
      }
    })
  }

  ngOnChanges() {
    this.isPoNumberValid = this.poCard.projectDetails.valid
  }

  formInit() {
    this.poTerms = this.formBuilder.group({
      textArea: []
    })
  }
  collateResults() {
    if (this.poTable.ratesBaseCurr) {
      this.poTable.setRateBaseCurr(false);
    }
    let poDataCollate: POData = {
      supplierAddress: this.poData.supplierAddress,
      projectAddress: this.poData.projectAddress,
      billingAddress: this.poData.billingAddress,
      materialData: this.poTable.getData() as PoMaterial[],
      additionalOtherCostInfo: this.poTable.getadditonalCost() ? this.poTable.getadditonalCost() : null,
      purchaseOrderDetailId: 0,
      purchaseOrderId: this.poId,
      poNumber: this.poCard.getData().orderNo,
      poName: "",
      poValidUpto: this.poCard.getData().endDate,
      purchaseOrderCurrency: this.poTable.getUpdatedCurrency() ? this.poTable.getUpdatedCurrency() : null,
      isInternational: 0,
      DocumentsList: this.poDocument.getData(),
      Terms: {
        termsDesc: this.poTerms.value['textArea'],
        termsType: 'PO'
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
      width: "400px",
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.poService.sendPoData(result).then(res => {
        if (res.status === 0 && res.message === "gst field missing from billing address") {
          this.openProjectDialog(data);
        }

        else {
          this.navService.gaEvent({
            action: 'submit',
            category: 'sent_approval_po',
            label: null,
            value: null
          });
          this._snackBar.open(
            res.message,
            "",
            {
              duration: 2000,
              panelClass: ["warning-snackbar"],
              verticalPosition: "bottom"
            }
          );
          this.router.navigate(["po"]);
        }
      });
    });
  }

  openProjectDialog(data: POData) {
    const dialogRef = this.dialog.open(GSTINMissingComponent, {
      width: "400px",
      data
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
    this.poService.approveRejectPo(this.collatePoData).then(res => {
      if (res.status === 0) {
        this._snackBar.open(
          res.message,
          "",
          {
            duration: 2000,
            panelClass: ["warning-snackbar"],
            verticalPosition: "bottom"
          }
        );
      } else {
        if (decision === "approved") {
          this.navService.gaEvent({
            action: 'submit',
            category: 'approve_po',
            label: null,
            value: null
          });
        }
        else {
          this.navService.gaEvent({
            action: 'submit',
            category: 'rejection',
            label: null,
            value: null
          });
        }

        this._snackBar.open(
          res.message,
          "",
          {
            duration: 2000,
            panelClass: ["warning-snackbar"],
            verticalPosition: "bottom"
          }
        );
        this.router.navigate(["po"]);
      }
    });
  }

  startSubscription() {
    this.subscriptions.push(
      combineLatest([this.poService.billingRole$, this.poService.projectRole$, this.poService.billingAddress$, this.poService.supplierAddress$, this.poService.poNumber$]).subscribe(values => {
        this.isPoValid = true;
        this.ValidPOTemp = true;
        this.cdr.detectChanges();
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }
  QuantityAmountValidation(event) {
    if (this.ValidPOTemp)
      this.isPoValid = event;

    if (!this.ValidPOTemp)
      this.isPoValid = false;
  }
  downloadPo() {
    this.poService.downloadPo(this.poId).then(res => {
      this.downloadFile(res.data);
    });
  }

  downloadFile(data: DownloadData) {
    var win = window.open(data.url, '_blank');
    win.blur();
    setTimeout(win.focus, 0);
  }
  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (event.currentTarget.innerWidth <= 576) {
      this.showResponsiveDesign = true;
    } else {
      this.showResponsiveDesign = false;
    }

    if (event.currentTarget.innerWidth <= 1028) {
      this.showResponsiveDesignDown = true;
    } else {
      this.showResponsiveDesignDown = false;
    }
  }
}
