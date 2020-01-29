import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RfqMaterialResponse } from "../../models/RFQ/rfq-details";

// Component for dialog box
@Component({
  selector: "address-dialog",
  templateUrl: "./address-dialog.html"
})

// Component class
export class AddAddressDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RfqMaterialResponse
  ) {}
  ngOnInit() {
    console.log("data", this.data);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
