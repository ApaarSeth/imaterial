import { Component, Inject } from "@angular/core";
import { RfqMaterialResponse, Address } from "../../models/RFQ/rfq-details";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddAddressService } from "../../services/add-address/add-address.service";
import { FieldRegExConst } from '../../constants/field-regex-constants';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface City {
  value: string;
  viewValue: string;
}
// Component for dialog box
@Component({
  selector: "address-dialog",
  templateUrl: "./address-dialog.html"
})

// Component class
export class AddAddressDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RfqMaterialResponse,
    private formBuilder: FormBuilder,
    private addAddressService: AddAddressService
  ) { }
  selectAddressFrm: FormGroup;
  newAddressForm: FormGroup;
  address: Address;
  ngOnInit() {
    this.formInit();
  }
  cities: City[] = [
    { value: "Gurgaon", viewValue: "Gurgaon" },
    { value: "Delhi-1", viewValue: "Delhi" },
    { value: "Karnal", viewValue: "Karnal" }
  ];

  formInit() {
    this.selectAddressFrm = this.formBuilder.group({
      address: []
    });

    // new address form
    this.newAddressForm = this.formBuilder.group({
      addressLine1: ["", [Validators.required, Validators.maxLength(120)]],
      addressLine2: ["", Validators.maxLength(120)],
      pinCode: ["", [Validators.required, Validators.pattern(FieldRegExConst.PINCODE)]],
      state: ["", Validators.required],
      city: ["", Validators.required]
    });

  }

  onNoClick(): void {
    this.data.projectAddressList = this.data.projectAddressList.map(address => {
      address.primaryAddress = 0;
      return address;
    });
    this.selectAddressFrm.value.address.primaryAddress = 1;
    this.data.defaultAddress = this.selectAddressFrm.value.address;
    this.dialogRef.close();
  }

  onNoClick1(): void {
    this.address = this.newAddressForm.value;
    this.postAddAddress(this.address);
  }

  postAddAddress(address) {
    this.addAddressService
      .postAddAddress("Project", this.data.projectId, address)
      .then(res => {
        res.data;
        this.data.defaultAddress = res.data;
        this.data.projectAddressList.push(res.data);
      });
  }
}
