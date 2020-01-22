import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

// Component for dialog box
@Component({
  selector: "address-dialog",
  templateUrl: "./address-dialog.html"
})

// Component class
export class AddAddressDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddAddressDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
