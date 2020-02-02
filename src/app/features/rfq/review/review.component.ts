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

@Component({
  selector: "review",
  templateUrl: "./review.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class ReviewComponent implements OnInit {
  displayedColumns: string[] = ["Material Name", "Quantity", "Makes"];
  checkedMaterialsList: RfqMaterialResponse[];
  selectedSuppliersList: Suppliers[];
  documentList: DocumentList[];
  form: FormGroup;
  supplierIds: number[];
  rfqDetails: AddRFQ = {} as AddRFQ;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.checkedMaterialsList = history.state.checkedMaterialsList;
    this.selectedSuppliersList = history.state.selectedSuppliersList;
    this.documentList = history.state.documentsList;
    this.supplierIds = this.selectedSuppliersList.map(x => x.supplierId);
    console.log("supplierIds", this.supplierIds);
    console.log("checkedMaterialsList", this.checkedMaterialsList);
    console.log("selectedSuppliersList", this.selectedSuppliersList);
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

  setRFQDetailsValue() {
    if (this.form.value) {
      this.rfqDetails.rfqName = this.form.value.rfqName;
      this.rfqDetails.dueDate = this.form.value.dueDate;
    }
    this.rfqDetails.rfqProjectsList = this.checkedMaterialsList;
    this.rfqDetails.supplierId = this.supplierIds;
    this.rfqDetails.documentsList = this.documentList;
    this.rfqDetails.terms = {
      termsDesc: "qwert hjk ghgjhkj vhj hhv jh",
      termsType: "RFQ"
    };
    console.log("rfqDetails", this.rfqDetails);
    this.openDialog3(this.rfqDetails);
    //this.addRFQ(this.rfqDetails);
  }

  openDialog1(): void {
    if (AddCommentDialogComponent) {
      const dialogRef = this.dialog.open(AddCommentDialogComponent, {
        width: "1200px"
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("The dialog was closed");
      });
    }
  }
  openDialog2(): void {
    if (ViewDocumentsDialogComponent) {
      const dialogRef = this.dialog.open(ViewDocumentsDialogComponent, {
        width: "1200px"
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("The dialog was closed");
      });
    }
  }

  openDialog3(data): void {
    console.log("sdfghjk", data);
    if (AddRFQConfirmationComponent) {
      const dialogRef = this.dialog.open(AddRFQConfirmationComponent, {
        width: "500px",
        data: {
          dataKey: data
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("The dialog was closed");
      });
    }
  }
}
