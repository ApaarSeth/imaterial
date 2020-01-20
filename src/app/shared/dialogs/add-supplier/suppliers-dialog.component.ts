import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

// Component for dialog box
@Component({
  selector: "suppliers-dialog",
  templateUrl: "./suppliers-dialog.html"
})

// Component class
export class SuppliersDialogComponent {
  constructor(public dialogRef: MatDialogRef<SuppliersDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
