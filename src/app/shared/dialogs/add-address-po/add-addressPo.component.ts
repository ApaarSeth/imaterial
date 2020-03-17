import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RfqMaterialResponse, Address } from "../../models/RFQ/rfq-details";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddAddressService } from "../../services/add-address/add-address.service";
import { ProjectService } from '../../services/projectDashboard/project.service';
import { FieldRegExConst } from '../../constants/field-regex-constants';

export interface City {
  value: string;
  viewValue: string;
}
// Component for dialog box
@Component({
  selector: "address-dialog",
  templateUrl: "./add-addressPo.html"
})

// Component class
export class AddAddressPoDialogComponent {
  validPincode: boolean;
  pincodeLength: number;
  constructor(
    public dialogRef: MatDialogRef<AddAddressPoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private addAddressService: AddAddressService,
    private projectService: ProjectService
  ) {}

  selectAddressFrm: FormGroup;
  newAddressForm: FormGroup;
  address: Address;
  city: string;
  state: string;

  ngOnInit() {
    if (this.data.roleType === "projectBillingAddressId") {
      this.addAddressService
        .getPoAddAddress("Project", this.data.id)
        .then(res => {
          this.address = res.data;
          // console.log("addressProject", this.address);
        });
    } else {
      this.addAddressService
        .getPoAddAddress("Supplier", this.data.id)
        .then(res => {
          this.address = res.data;
          // console.log("addressSupplier", this.address);
        });
    }
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
    // console.log("form data", this.selectAddressFrm);

    // new address form
    this.newAddressForm = this.formBuilder.group({
      addressLine1: ["", Validators.required],
      addressLine2: [""],
      pinCode: ["", [Validators.required,Validators.pattern(FieldRegExConst.PINCODE)]],
      state: [{ value: "", disabled: true }, Validators.required],
      city: [{ value: "", disabled: true }, Validators.required],
      gstNo: ["",  [Validators.required, Validators.pattern(FieldRegExConst.GSTIN)]]
    });
    // console.log("addresss", this.newAddressFor,m.value);
  }

  onselectAddress(): void {
    this.dialogRef.close([this.data.roleType, this.selectAddressFrm.value]);
  }

  onAddAddress(): void {
    this.postAddAddress(
      this.data.roleType === "projectBillingAddressId" ? "project" : "supplier",
      this.newAddressForm.value
    );
  }
  
  postAddAddress(role, address) {
    this.addAddressService
      .postAddAddress(role, this.data.id, address)
      .then(res => {
        this.dialogRef.close([this.data.roleType, { address: res.data }]);
      });
  }

  getPincode(event) {
        this.validPincode = false;
        this.city = "";
        this.state = "";
        this.newAddressForm.get('city').setValue("");
        this.newAddressForm.get('state').setValue("");
        this.pincodeLength = event.target.value.length;
    if (event.target.value.length == 6) {
      this.cityStateFetch(event.target.value);
    }
  }

  cityStateFetch(value) {
    this.projectService.getPincode(value).then(res => {
      if (res.data) {
        this.city = res.data[0].districtName;
        this.state = res.data[0].stateName;
        if(this.city && this.state)
        this.validPincode = true;
        else
        this.validPincode = false;

        this.newAddressForm.get('city').setValue(res.data[0].districtName);
        this.newAddressForm.get('state').setValue(res.data[0].stateName);
      }
    });
  }
  close(){
    this.dialogRef.close(null);
  }
}