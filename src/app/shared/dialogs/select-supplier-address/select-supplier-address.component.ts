import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Address } from "../../models/RFQ/rfq-details";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "select-supplier-address-dialog",
  templateUrl: "./select-supplier-address.component.html"
})

export class SelectSupplierAddressDialogComponent implements OnInit {

  validPincode: boolean;
  pincodeLength: number;
  supplierAddresses: any;
  addressId: number = null;
  selectAddressFrm: FormGroup;
  newAddressForm: FormGroup;
  address: Address;
  city: string;
  state: string;

  constructor(
    public dialogRef: MatDialogRef<SelectSupplierAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.supplierAddresses = this.data.supplierAddresses.data;
  }

  onChange(event) {
    this.addressId = event.value.addressId;
  }

  onselectAddress() {
    this.dialogRef.close({ data: this.addressId })
  }

  close() {
    this.dialogRef.close(null);
  }
}