import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Documents } from '../../models/RFQ/rfq-view';

// Component for dialog box
@Component({
  selector: "show-documents",
  templateUrl: "./show-documents.component.html"
})

// Component class
export class ShowDocumentComponent implements OnInit {
  documentList : Documents[];
  constructor(public dialogRef: MatDialogRef<ShowDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  ngOnInit() {
    this.documentList = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
