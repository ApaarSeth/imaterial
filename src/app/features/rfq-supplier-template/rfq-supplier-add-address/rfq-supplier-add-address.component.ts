import { AppNavigationService } from './../../../shared/services/navigation.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SendRfqObj } from "../../../shared/models/RFQ/rfq-details-supplier";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CountryCode } from "../../../shared/models/currency";
import { MatDialog } from "@angular/material/dialog";
import { POService } from "../../../shared/services/po.service";
import { CommonService } from "../../../shared/services/commonService";
import { FieldRegExConst } from "../../../shared/constants/field-regex-constants";
import { ConfirmRfqBidComponent } from "../../../shared/dialogs/confirm-rfq-bid/confirm-frq-bid-component";
import { SelectSupplierAddressDialogComponent } from "../../../shared/dialogs/select-supplier-address/select-supplier-address.component";

@Component({
  selector: "rfq-supplier-add-address",
  templateUrl: "./rfq-supplier-add-address.component.html"
})

export class RFQSupplierAddAddressComponent implements OnInit {

  materialCount: number = 0;
  brandCount: number = 0;
  rfqSupplierObj: SendRfqObj;
  supplierAddress: any;
  supplierId: number;
  form: FormGroup;
  materialForms: FormGroup;
  city: string;
  state: string;
  pincodeLength: number;
  validPincode: boolean;
  addSupplierAddress: boolean;
  selectedAddress: any;
  AddressValid: boolean;
  disabledAddress: boolean = false;
  ipaddress: string;
  countryList: CountryCode[] = [];
  livingCountry: CountryCode[] = [];
  searchCountry: string = '';
  selectedCountryId: number;
  isCallingCode: string;
  isInternational: number;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private poService: POService,
    private router: Router,
    private commonService: CommonService,
    private navService: AppNavigationService
  ) { }

  ngOnInit() {
    this.rfqSupplierObj = history.state.rfqSupplierObj;
    this.supplierId = history.state.supplierId;
    this.brandCount = this.activatedRoute.snapshot.params[ "brandList" ];
    this.materialCount = this.activatedRoute.snapshot.params[ "MaterialList" ];
    this.isInternational = Number(localStorage.getItem('isInternational'));

    this.poService.getSupplierAddress(this.supplierId).then(data => {

      this.supplierAddress = data;
      this.getLocation();
      if (this.supplierAddress && this.supplierAddress.data.length < 2 && this.supplierAddress.data[ 0 ].supplierAddressId == 0) {
        this.AddressValid = false;
      }
      else {
        this.AddressValid = true;
      }

      if (this.supplierAddress && this.supplierAddress.data[ 0 ].supplierAddressId == 0 || this.supplierAddress.data[ 0 ].addressId == null || this.supplierAddress.data[ 0 ].addressId == "") {

        this.initForm();

        this.form.controls.supplierName.setValidators([ Validators.required ]);
        this.form.controls.supplierName.updateValueAndValidity();

        this.form.controls.contactNo.setValidators([ Validators.required, Validators.pattern(FieldRegExConst.PHONE) ]);
        this.form.controls.contactNo.updateValueAndValidity();

        this.form.controls.email.setValidators([ Validators.required, Validators.pattern(FieldRegExConst.EMAIL) ]);
        this.form.controls.email.updateValueAndValidity();

        this.form.controls.contactNo.setValidators([ Validators.required, Validators.pattern(FieldRegExConst.PHONE) ]);
        this.form.controls.contactNo.updateValueAndValidity();

        this.form.controls.addressLine1.setValidators([ Validators.required, Validators.maxLength(120) ]);
        this.form.controls.addressLine1.updateValueAndValidity();

        this.form.controls.addressLine2.setValidators([ Validators.maxLength(120) ]);
        this.form.controls.addressLine2.updateValueAndValidity();

        this.form.controls.pinCode.setValidators([ Validators.required, Validators.minLength(4), Validators.maxLength(6) ]);
        this.form.controls.pinCode.updateValueAndValidity();

        this.form.controls.state.setValidators([ Validators.required ]);
        this.form.controls.state.updateValueAndValidity();

        this.form.controls.city.setValidators([ Validators.required ]);
        this.form.controls.city.updateValueAndValidity();

        if (this.isInternational === 0) {
          this.form.controls.gstNo.setValidators([ Validators.required, Validators.pattern(FieldRegExConst.GSTIN) ]);
        } else {
          this.form.controls.gstNo.setValidators([ Validators.pattern(FieldRegExConst.GSTIN) ]);
        }
        this.form.controls.gstNo.updateValueAndValidity();

      } else {
        this.addSupplierAddress = true;
        this.initForm();
        this.form.controls.state.setValidators([ Validators.required ]);
        this.form.controls.state.updateValueAndValidity();

        this.form.controls.city.setValidators([ Validators.required ]);
        this.form.controls.city.updateValueAndValidity();
      }

    })

  }

  getLocation() {
    if (this.selectedAddress && this.selectedAddress.countryId) {
      this.getCountryCode({ callingCode: null, countryId: this.selectedAddress.countryId });
    } else if (this.supplierAddress.data.length && this.supplierAddress.data[ 0 ].countryId) {
      this.getCountryCode({ callingCode: null, countryId: this.supplierAddress.data[ 0 ].countryId });
    }
  }

  getCountryCode(obj) {
    this.commonService.getCountry().then(res => {
      this.countryList = res.data;
      this.livingCountry = this.countryList.filter(val => {
        if (obj.countryId) {
          return val.countryId === Number(obj.countryId);
        } else {
          return val.callingCode === obj.callingCode;
        }
      })
      this.form.get('countryCode').setValue(this.livingCountry[ 0 ]);
    })
  }

  get selectedCountry() {
    if (this.form.get('countryCode').value) {
      this.selectedCountryId = this.form.get('countryCode').value.countryId;
    }
    return this.form.get('countryCode').value;
  }

  blankPincode() {
    this.form.get('pinCode').setValue('');
    this.city = "";
    this.state = "";
    this.form.get('city').setValue("");
    this.form.get('state').setValue("");
  }

  initForm() {

    this.form = this.formBuilder.group({

      supplierName: [
        { value: this.supplierAddress.data ? this.supplierAddress.data[ 0 ].supplierName : "", disabled: true }
      ],
      contactNo: [
        { value: this.supplierAddress.data ? this.supplierAddress.data[ 0 ].contactNo : "", disabled: true }
      ],
      email: [
        { value: this.supplierAddress.data ? this.supplierAddress.data[ 0 ].email : "", disabled: true }
      ],

      addressLine1: [
        { value: (this.selectedAddress && this.selectedAddress.addressLine1) ? this.selectedAddress.addressLine1 : "", disabled: this.disabledAddress }, Validators.maxLength(120)
      ],
      addressLine2: [ { value: (this.selectedAddress && this.selectedAddress.addressLine2) ? this.selectedAddress.addressLine2 : "", disabled: this.disabledAddress }, Validators.maxLength(120) ],
      pinCode: [
        { value: (this.selectedAddress && this.selectedAddress.pinCode) ? this.selectedAddress.pinCode : "", disabled: this.disabledAddress },
        // [Validators.required, Validators.pattern(FieldRegExConst.PINCODE)]
        [ Validators.required ]
      ],
      state: [
        { value: (this.selectedAddress && this.selectedAddress.state) ? this.selectedAddress.state : "", disabled: true },
        Validators.required
      ],
      city: [
        { value: (this.selectedAddress && this.selectedAddress.city) ? this.selectedAddress.city : "", disabled: true },
        Validators.required
      ],
      gstNo: [
        { value: (this.selectedAddress && this.selectedAddress.gstNo) ? this.selectedAddress.gstNo : "", disabled: this.disabledAddress },
        [ Validators.pattern(FieldRegExConst.GSTIN) ]
      ],
      countryId: [ null ],
      countryCode: []
    });
    if (this.form.value.pinCode)
      this.validPincode = true;

    if (this.isInternational === 0) {
      this.form.get('gstNo').setValidators([ Validators.required, Validators.pattern(FieldRegExConst.GSTIN) ]);
    }

  }

  saveAddress() {
    this.openDialog();
  }
  getPincode(event) {
    this.validPincode = false;
    this.city = "";
    this.state = "";
    this.form.get('city').setValue("");
    this.form.get('state').setValue("");
    this.pincodeLength = event.target.value.length;

    if (event.target.value.length >= 3) {
      this.getCityAndState(event.target.value);
    }

  }

  getCityAndState(value) {
    this.commonService.getPincodeInternational(value, this.selectedCountryId).then(res => {
      if (res.data && res.data.length) {
        this.city = res.data[ 0 ].districtName;
        this.state = res.data[ 0 ].stateName;
        if (this.city && this.state)
          this.validPincode = true;
        else
          this.validPincode = false;

        this.form.get('city').setValue(res.data[ 0 ].districtName);
        this.form.get('state').setValue(res.data[ 0 ].stateName);
      }

    });
  }

  openDialog(): void {
    if (this.city && this.state) {
      this.form.value.city = this.city;
      this.form.value.state = this.state;
    }

    this.form.value.countryId = this.form.get('countryCode').value.countryId;
    delete this.form.value.countryCode;

    const dialogRef = this.dialog.open(ConfirmRfqBidComponent, {
      data: { rfqSupplierData: this.rfqSupplierObj, disabledAddress: this.disabledAddress, supplierAddress: this.form.value, supplierId: this.supplierId },
      width: "800px"
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(data => {
        if (data != null && data.status == 1) {
          this.navService.gaEvent({
            action: 'submit',
            category: 'submit_bid',
            label: null,
            value: null
          });
          this.router.navigate([ "/rfq-bids/finish/" + this.brandCount + "/" + this.materialCount ]);
        }
      });
  }

  openAddressDialog(): void {
    if (this.AddressValid) {
      const dialogRef = this.dialog.open(SelectSupplierAddressDialogComponent, {
        data: { supplierAddresses: this.supplierAddress },
        width: "800px",
        panelClass: [ 'common-modal-style', 'choose-address-dialog' ]
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(res => {
          if (res) {
            this.supplierAddress.data.forEach(element => {
              if (res && (element.addressId == res.data)) {
                this.disabledAddress = true;
                this.selectedAddress = element;
                this.isCallingCode = element.callingCode;
                this.getCityAndState(element.pinCode);
                this.getLocation();
              }
            });
            this.initForm();
          }
        });
    }

  }

  reset() {
    this.selectedAddress = {};
    this.getLocation();
    this.disabledAddress = false;
    this.initForm();
    this.form.controls.addressLine1.setValue(null);
    //  this.form.controls.addressLine1.setErrors(null);

    this.form.controls.addressLine2.setValue(null);
    this.form.controls.addressLine2.setErrors(null);

    this.form.controls.pinCode.setValue(null);
    //  this.form.controls.pinCode.setErrors(null);

    this.form.controls.state.setValue(null);
    this.form.controls.state.setErrors(null);

    this.form.controls.city.setValue(null);
    this.form.controls.city.setErrors(null);

    this.form.controls.gstNo.setValue(null);
    // this.form.controls.gstNo.setErrors(null);

  }


}