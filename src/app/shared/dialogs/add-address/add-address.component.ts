import { AppNotificationService } from './../../services/app-notification.service';
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { Address } from "../../models/RFQ/rfq-details";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddAddressService } from "../../services/add-address.service";
import { FieldRegExConst } from '../../constants/field-regex-constants';
import { CommonService } from '../../services/commonService';
import { CountryCode } from '../../models/currency';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTabGroup } from "@angular/material/tabs";
@Component({
  selector: "address-dialog",
  templateUrl: "./add-address.component.html"
})



export class AddAddressDialogComponent implements OnInit {
  @ViewChild('tabs') tabGroup: MatTabGroup;
  validPincode: boolean;
  searchCountry: string = '';
  pincodeLength: number;
  ipaddress: string;
  countryList: CountryCode[] = [];
  livingCountry: CountryCode[] = [];
  selectAddressFrm: FormGroup;
  newAddressForm: FormGroup;
  address: Address[];
  city: string;
  state: string;
  selectedCountryId: number;
  currentIndex: number = 0;
  countryCode: string
  tab2Label: string = "Add Address"
  addressId: number;
  constructor(
    public dialogRef: MatDialogRef<AddAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private addAddressService: AddAddressService,
    private _snackBar: MatSnackBar,
    private commonService: CommonService,
    private notifier: AppNotificationService
  ) { }

  ngOnInit() {
    this.countryCode = localStorage.getItem('countryCode')
    if (this.data.roleType === "projectBillingAddressId") {
      this.addAddressService
        .getPoAddAddress("Project", this.data.id)
        .then(res => {
          this.address = res.data;
        });
    } else {
      this.addAddressService
        .getPoAddAddress("Supplier", this.data.id)
        .then(res => {
          this.address = res.data;
        });
    }
    this.formInit();
  }

  tabClick($event) {
    this.currentIndex = $event.index;
    if (this.currentIndex === 1) {
      this.getCountryCode(localStorage.getItem('countryId'))
    }
    else if (this.currentIndex === 0) {
      this.tab2Label = "Add Address"
    }
  }

  changeIndex(add: Address) {
    this.tabGroup.selectedIndex = 1;
    this.addressId = add.addressId;
    this.tab2Label = "Edit Address"
    this.newAddressForm.patchValue({
      addressLine1: add.addressLine1,
      addressLine2: add.addressLine2,
      pinCode: add.pinCode,
      gstNo: add.gstNo,
    })
  }

  blankPincode() {
    this.newAddressForm.get('pinCode').setValue('');
    this.city = "";
    this.state = "";
    this.newAddressForm.get('city').setValue("");
    this.newAddressForm.get('state').setValue("");
  }

  getCountryCode(countryId) {
    this.commonService.getCountry().then(res => {
      this.countryList = res.data;
      this.livingCountry = this.countryList.filter(val => {
        return val.countryId === Number(countryId);
      })
      this.newAddressForm.get('countryCode').setValue(this.livingCountry[0]);
    })
  }

  get selectedCountry() {
    if (this.newAddressForm.get('countryCode').value) {
      this.selectedCountryId = this.newAddressForm.get('countryCode').value.countryId;
    }
    return this.newAddressForm.get('countryCode').value;
  }

  formInit() {
    this.selectAddressFrm = this.formBuilder.group({
      address: []
    });

    // new address form
    this.newAddressForm = this.formBuilder.group({
      addressLine1: ["", [Validators.required, Validators.maxLength(120)]],
      addressLine2: ["", Validators.maxLength(120)],
      // pinCode: ["", [Validators.required, Validators.pattern(FieldRegExConst.PINCODE)]],
      pinCode: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      state: [{ value: "", disabled: true }, Validators.required],
      city: [{ value: "", disabled: true }, Validators.required],
      gstNo: [""],
      imageUrl: [this.data.isEdit ? this.data.detail.imageFileName : ""],
      countryId: [null],
      countryCode: []
    });
    this.newAddressForm.get('pinCode').valueChanges.subscribe(res => {
      this.getPincode(res)
    })

    if (this.countryCode == 'IN') {
      this.newAddressForm.get('gstNo').setValidators([Validators.required, Validators.pattern(FieldRegExConst.GSTIN)])
    }
  }

  onselectAddress(): void {
    this.dialogRef.close([this.data.roleType, this.selectAddressFrm.value]);
  }

  onAddAddress(): void {
    if (this.tab2Label === 'Add Address') {
      this.postAddAddress(
        this.data.roleType === "projectBillingAddressId" ? "project" : "supplier",
        this.newAddressForm.getRawValue()
      );
    }
    else {
      let data = {
        type: this.data.roleType === "projectBillingAddressId" ? "project" : "supplier",
        address: this.addressId,
        ...this.newAddressForm.getRawValue()
      }
      this.postEditAddress(data);
    }
  }

  postEditAddress(data) {
    this.addAddressService.postEditAddress(this.addressId, data).then(res => {
      if (res.statusCode == 201) {
        this.notifier.snack(res.message)
        this.dialogRef.close([this.data.roleType, { address: res.data[0] }]);
      }
      else {
        this.notifier.snack(res.message)
      }
    });
  }

  postAddAddress(role, address) {
    this.addAddressService
      .postAddAddress(role, this.data.id, address)
      .then(res => {
        if (res.statusCode == 201) {
          this.notifier.snack(res.message)
        }
        else {
          this.notifier.snack(res.message)
          this.dialogRef.close([this.data.roleType, { address: res.data }]);
        }
      });
  }

  getPincode(event) {
    if (event) {
      this.validPincode = false;
      this.city = "";
      this.state = "";
      this.newAddressForm.get('city').setValue("");
      this.newAddressForm.get('state').setValue("");
      // this.pincodeLength = event;
      if (event.length >= 3) {
        this.cityStateFetch(event);
      }
    }
  }

  cityStateFetch(value) {
    this.commonService.getPincodeInternational(value, this.selectedCountryId).then(res => {
      if (res.data && res.data.length) {
        this.city = res.data[0].districtName;
        this.state = res.data[0].stateName;
        if (this.city && this.state)
          this.validPincode = true;
        else
          this.validPincode = false;

        this.newAddressForm.get('city').setValue(res.data[0].districtName);
        this.newAddressForm.get('state').setValue(res.data[0].stateName);
      }
    });
  }

  close() {
    this.dialogRef.close(null);
  }
}