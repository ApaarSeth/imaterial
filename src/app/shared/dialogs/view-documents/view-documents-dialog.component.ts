import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

// Component for dialog box
@Component({
  selector: "view-documents",
  templateUrl: "./view-documents-dialog.html"
})

// Component class
export class ViewDocumentsDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ViewDocumentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
