import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { AddCommentDialogComponent } from "src/app/shared/dialogs/add-comment/comment-dialog.component";
import { ViewDocumentsDialogComponent } from "src/app/shared/dialogs/view-documents/view-documents-dialog.component";
import {
  RfqMaterialResponse,
  AddRFQ
} from "src/app/shared/models/RFQ/rfq-details";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { AddRFQConfirmationComponent } from "src/app/shared/dialogs/add-rfq-confirmation/add-rfq-double-confirmation.component";
import { DocumentList } from "src/app/shared/models/PO/po-data";
import { Router, ActivatedRoute } from "@angular/router";
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';

@Component({
  selector: "review",
  templateUrl: "./review.component.html"
})
export class ReviewComponent implements OnInit {
  displayedColumns: string[] = ["Material Name", "Required Date", "Quantity", "Makes"];
  finalRfq: AddRFQ;
  selectedSuppliersList: Suppliers[];
  documentList: DocumentList[];
  form: FormGroup;
  supplierIds: number[];
  rfqDetails: AddRFQ = {} as AddRFQ;
  checkedList: RfqMaterialResponse[];
  rfqId: number;
  public RfqPreviewTour: GuidedTour = {
    tourId: 'rfq-preview-tour',
    useOrb: false,

    steps: [
      {
        title: 'Float RFQ',
        selector: '.float-rfq-btn',
        content: 'Click here to float RFQ to the selected suppliers.',
        orientation: Orientation.Left
      }
    ]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private guidedTourService: GuidedTourService
  ) {

    setTimeout(() => {
      this.guidedTourService.startTour(this.RfqPreviewTour);
    }, 1000);
  }

  ngOnInit() {
    // this.finalRfq = history.state.finalRfq;
    // this.checkedList = this.finalRfq.rfqProjectsList;
    // this.selectedSuppliersList = this.finalRfq.supplierDetails;
    this.activatedRoute.params.subscribe(params => {
      this.rfqId = params['rfqId']
      if (this.rfqId) {
        this.rfqService.getDraftRfq(this.rfqId).then(res => {
          this.finalRfq = res.data;
          this.checkedList = this.finalRfq.rfqProjectsList;
          this.selectedSuppliersList = this.finalRfq.supplierDetails;
        })
      }

    })

    // this.documentList = history.state.documentsList;
    // this.supplierIds = this.selectedSuppliersList.map(x => x.supplierId);
    // console.log("supplierIds", this.supplierIds);
    // console.log("checkedMaterialsList", this.checkedMaterialsList);
    // console.log("selectedSuppliersList", this.selectedSuppliersList);
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      rfqName: ["", Validators.required],
      dueDate: ["", Validators.required]
    });
  }

  submit() {
    console.log("form", this.form.value);
    this.setRFQDetailsValue();
  }

  formatDate(oldDate): Date {
    let newDate = new Date(oldDate);
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    return newDate;
  }

  setRFQDetailsValue() {
    if (this.form.value) {
      this.finalRfq.rfqName = this.form.value.rfqName;
      this.finalRfq.dueDate = this.formatDate(this.form.value.dueDate);
    }
    // this.rfqDetails.rfqProjectsList = this.checkedMaterialsList;
    // this.rfqDetails.supplierId = this.supplierIds;
    // this.rfqDetails.documentsList = this.documentList;
    // this.rfqDetails.terms = {
    //   termsDesc: "qwert hjk ghgjhkj vhj hhv jh",
    //   termsType: "RFQ"
    // };
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
    console.log("sdfghjk", data);
    if (AddRFQConfirmationComponent) {
      const dialogRef = this.dialog.open(AddRFQConfirmationComponent, {
        width: "500px",
        data: {
          dataKey: data
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.statusCode === 201) {
          this.router.navigate(["rfq/rfq-detail"]);
        }
      });
    }
  }
}
