import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Documents } from '../../models/RFQ/rfq-view';

@Component({
  selector: "show-documents",
  templateUrl: "./show-documents.component.html"
})

export class ShowDocumentComponent implements OnInit {
  
  documentList: Documents[];

  constructor(public dialogRef: MatDialogRef<ShowDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.documentList = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
