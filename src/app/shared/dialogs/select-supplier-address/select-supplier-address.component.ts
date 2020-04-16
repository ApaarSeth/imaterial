import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RfqMaterialResponse, Address } from "../../models/RFQ/rfq-details";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddAddressService } from "../../services/add-address/add-address.service";
import { ProjectService } from '../../services/projectDashboard/project.service';

export interface City {
  value: string;
  viewValue: string;
}
// Component for dialog box
@Component({
  selector: "select-supplier-address-dialog",
  templateUrl: "./select-supplier-address.component.html"
})

// Component class
export class SelectSupplierAddressDialogComponent {
  validPincode: boolean;
  pincodeLength: number;
  supplierAddresses: any;
  addressId: number = null;
  constructor(
    public dialogRef: MatDialogRef<SelectSupplierAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private addAddressService: AddAddressService,
    private projectService: ProjectService
  ) { }

  selectAddressFrm: FormGroup;
  newAddressForm: FormGroup;
  address: Address;
  city: string;
  state: string;

  ngOnInit() {
    this.supplierAddresses = this.data.supplierAddresses.data;
   console.log();
  }
 
 onChange(event){
   this.addressId = event.value.addressId;
  //  console.log("selected : "+ event.value.addressId);
 }
 onselectAddress(){
   this.dialogRef.close({data : this.addressId})
 }
  close() {
    this.dialogRef.close(null);
  }
}