import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

// Component for dialog box
@Component({
  selector: "view-documents",
  templateUrl: "./view-documents-dialog.html"
})

// Component class
export class ViewDocumentsDialogComponent {
  constructor(public dialogRef: MatDialogRef<ViewDocumentsDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
