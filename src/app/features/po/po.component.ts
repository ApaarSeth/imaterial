import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { POService } from "src/app/shared/services/po/po.service";
import {
  POData,
  PoMaterial,
  CardData,
  poApproveReject,
  DocumentList,
  terms
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
    key: Froala.key
  }

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


  constructor(
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
 

    this.route.params.subscribe(poParams => {
      this.poId = Number(poParams.id);
      this.mode = poParams.mode;
    });
    this.poService.getPoGenerateData(this.poId).then(res => {
      this.poData = res.data;
      this.tableData = this.poData.materialData;
      this.cardData = {
        supplierAddress: this.poData.supplierAddress,
        projectAddress: this.poData.projectAddress,
        billingAddress: this.poData.billingAddress,
        poNumber: this.poData.poNumber,
        poValidUpto: this.poData.poValidUpto,
        projectId: this.poData.projectId
      };
      this.documentList = this.poData.DocumentsList;
      this.terms = this.poData.Terms;
      if ((localStorage.getItem('po') == "null") || (localStorage.getItem('po') == '0')) {
        setTimeout(() => {
          this.guidedTourService.startTour(this.POPreviewTour);
        }, 1000);
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

        termsDesc: this.poTerms['textArea'],
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
        if (res.status === 0) {
          if (res.message = "gst field missing from billing address") {
            this.openProjectDialog();
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
          this.router.navigate(["po/detail-list"]);
        }
      });
    });
  }

  openProjectDialog() {
    const dialogRef = this.dialog.open(GSTINMissingComponent, {
      width: "400px"

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
        this.router.navigate(["po/detail-list"]);
      }
    });
  }

  startSubscription() {
    this.subscriptions.push(
      combineLatest([this.poService.billingRole$, this.poService.projectRole$, this.poService.billingAddress$, this.poService.supplierAddress$, this.poService.poNumber$]).subscribe(values => {
        this.isPoValid = true;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

}
