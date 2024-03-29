import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddCommentDialogComponent } from "src/app/shared/dialogs/add-comment/comment-dialog.component";
import { ViewDocumentsDialogComponent } from "src/app/shared/dialogs/view-documents/view-documents-dialog.component";
import { RfqMaterialResponse, AddRFQ } from "src/app/shared/models/RFQ/rfq-details";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq.service";
import { AddRFQConfirmationComponent } from "src/app/shared/dialogs/add-rfq-confirmation/add-rfq-double-confirmation.component";
import { DocumentList } from "src/app/shared/models/PO/po-data";
import { Router, ActivatedRoute } from "@angular/router";
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { CommonService } from 'src/app/shared/services/commonService';
import { UserGuideService } from 'src/app/shared/services/user-guide.service';
import { SelectCurrencyComponent } from 'src/app/shared/dialogs/select-currency/select-currency.component';
import { ViewImageComponent } from 'src/app/shared/dialogs/view-image/view-image.component';

@Component({
  selector: "review",
  templateUrl: "./review.component.html"
})

export class ReviewComponent implements OnInit {

  displayedColumns: string[] = ["Material Name", "Required Date", "Quantity", "Makes", "Attached Images"];
  finalRfq: AddRFQ;
  selectedSuppliersList: Suppliers[];
  documentList: DocumentList[];
  form: FormGroup;
  supplierIds: number[];
  rfqDetails: AddRFQ = {} as AddRFQ;
  checkedList: RfqMaterialResponse[];
  rfqId: number;
  minDate = new Date();
  isMobile: boolean;
  userId: number;

  public RfqPreviewTour: GuidedTour = {
    tourId: 'rfq-preview-tour',
    useOrb: false,

    steps: [
      {
        title: 'Float RFP',
        selector: '.float-rfq-btn',
        content: 'Click here to float RFP to the selected suppliers.',
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private guidedTourService: GuidedTourService,
    private commonService: CommonService,
    private userGuideService: UserGuideService
  ) {}

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.userId = Number(localStorage.getItem("userId"));

    this.activatedRoute.params.subscribe(params => {
      this.rfqId = params['rfqId']
      if (this.rfqId) {
        this.rfqService.getDraftRfq(this.rfqId).then(res => {
          this.finalRfq = res.data;
          this.checkedList = this.finalRfq.rfqProjectsList;
          this.selectedSuppliersList = this.finalRfq.supplierDetails;
          if ((localStorage.getItem('rfq') == "null") || (localStorage.getItem('rfq') == '0')) {
            setTimeout(() => {
              this.guidedTourService.startTour(this.RfqPreviewTour);
            }, 1000);
          }
        })
      }
    });

    this.initForm();
  }

  setLocalStorage() {
    const popovers = {
      "userId": this.userId,
      "moduleName": "rfq",
      "enableGuide": 1
    };
    this.userGuideService.sendUserGuideFlag(popovers).then(res => {
      if (res) {
        localStorage.setItem('rfq', '1');
      }
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      rfqName: ["", Validators.required],
      dueDate: ["", Validators.required]
    });
  }

  submit() {
    this.setRFQDetailsValue();
  }

  setRFQDetailsValue() {
    if (this.form.value) {
      this.finalRfq.rfqName = this.form.value.rfqName;
      let date = new Date(this.commonService.formatDate(this.form.value.dueDate))
      let dummyMonth = date.getMonth() + 1;
      const year = date.getFullYear().toString();
      const month = dummyMonth > 9 ? dummyMonth.toString() : "0" + dummyMonth.toString();
      const day = date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();

      this.finalRfq.dueDate = year + "-" + month + "-" + day
    }

    this.openDialog3(this.finalRfq);
  }

  openDialog1(): void {
    if (AddCommentDialogComponent) {
      const dialogRef = this.dialog.open(AddCommentDialogComponent, {
        width: "1200px"
      });
      dialogRef.afterClosed().subscribe(result => { });
    }
  }

  openDialog2(): void {
    if (ViewDocumentsDialogComponent) {
      const dialogRef = this.dialog.open(ViewDocumentsDialogComponent, {
        width: "1200px"
      });
      dialogRef.afterClosed().subscribe(result => { });
    }
  }

  openDialog3(data: AddRFQ): void {
    if (AddRFQConfirmationComponent) {
      const dialogRef = this.dialog.open(AddRFQConfirmationComponent, {
        width: "500px",
        data: {
          dataKey: data
        },
        panelClass: ['common-modal-style', 'float-rfq-confirm-dialog']
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result !== null){
          if (result.statusCode === 201) {
            this.router.navigate(["rfq"]);
          }
        }
      });
    }
  }
  
  selectCurrency() {
    const dialogRef = this.dialog.open(SelectCurrencyComponent, {
      disableClose: true,
      width: "600px",
      data: this.finalRfq.rfqCurrency,
      panelClass: ['common-modal-style', 'select-currency-dialog']
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.finalRfq.rfqCurrency = data;
      }
    });
  }

  /**
   * function will call to open view image modal
   * @param rfqId, materialId, type
   */
  viewAllImages(materialId) {
    const dialogRef = this.dialog.open(ViewImageComponent, {
      disableClose: true,
      width: "500px",
      panelClass: ['common-modal-style', 'view-image-modal'],
      data: {
        rfqId: this.rfqId,
        materialId,
        type: 'rfq'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log(result);
      }
    });
  }
}
