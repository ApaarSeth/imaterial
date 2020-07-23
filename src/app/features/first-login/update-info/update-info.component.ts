import { OnInit, Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserRoles, UserDetails, TradeList, TurnOverList } from 'src/app/shared/models/user-details';
import { Router } from '@angular/router';
import { DocumentUploadService } from 'src/app/shared/services/document-download/document-download.service';
import { debug } from 'util';
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { MatSnackBar } from '@angular/material';
import { CommonService } from 'src/app/shared/services/commonService';
import { Currency, CountryCode } from 'src/app/shared/models/currency';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { permission } from 'src/app/shared/models/permissionObject';

export interface City {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html'
})

export class UpdateInfoComponent implements OnInit {

  roles: UserRoles[];
  userInfoForm: FormGroup;
  customTrade: FormGroup;
  users: UserDetails;
  tradeList: TradeList;
  turnOverList: TurnOverList;
  selectedTrades: TradeList[] = [];
  localImg: string | ArrayBuffer;
  filename: string;
  role: string;
  roleId: number;
  searchCountry: string = '';
  searchCurrency: string = '';
  cities: City[] = [
    { value: "Gurgaon", viewValue: "Gurgaon" },
    { value: "Delhi", viewValue: "Delhi" },
    { value: "Karnal", viewValue: "Karnal" }
  ];
  selectedTradesId: number[] = [];
  url: string;
  OthersId: number;
  imageFileSizeError: string;
  imageFileSizeCheck: boolean = true;
  fileTypes: string[] = ['png', 'jpeg', 'jpg'];
  currencyList: Currency[] = [];
  countryList: CountryCode[] = [];
  livingCountry: CountryCode[] = [];
  permissionObj: permission;
  isMobile: boolean;
  countryId: Number;
  countryCode: string;
  validPincode: boolean = false;
  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private permissionService: PermissionService,
    private _snackBar: MatSnackBar,
    private commonService: CommonService,
    private _router: Router,
    private _uploadImageService: DocumentUploadService,
    private navService: AppNavigationService) { }

  ngOnInit() {
    this.role = localStorage.getItem("role");
    this.permissionObj = this.permissionService.checkPermission(this.role);
    this.isMobile = this.commonService.isMobile().matches;
    this.countryCode = localStorage.getItem('countryCode')
    this.countryId = Number(localStorage.getItem('countryId'))
    this.formInit();
    this.getUserRoles();
    this.getTradesList();
    this.getCurrency();
    this.getCountryCode();
  }

  getCurrency() {
    this.commonService.getCurrency().then(res => {
      this.currencyList = res.data;
    })
  }

  getCountryCode() {
    this.commonService.getCountry().then(res => {
      const userId = localStorage.getItem("userId");
      this.countryList = res.data;
      this.getUserInformation(userId);
    })
  }

  get selectedCountry() {
    return this.userInfoForm.get('countryCode').value;
  }

  get selectedBaseCurrency() {
    return this.userInfoForm.get('baseCurrency').value;
  }

  getUserRoles() {
    this._userService.getRoles().then(res => {
      this.roles = res.data;
      this.roles.splice(2, 1);
      const id = this.roles.filter(opt => opt.roleName === this.role);
      this.roleId = id.length && id[0].roleId;
    })
  }

  getUserInformation(userId) {
    this._userService.getUserInfo(userId).then(res => {
      if (!localStorage.getItem('countryId')) {
        this.countryId = res.data[0].countryId;
        localStorage.setItem('countryId', res.data[0].countryId)
      }
      this.users = res.data ? res.data[0] : null;
      if (this.users.roleName === 'l1') {
        this.userInfoForm.controls.turnOverId.setValidators([Validators.required]);
        this.userInfoForm.controls.turnOverId.updateValueAndValidity();
      }
      if (this.countryList) {
        this.livingCountry = this.countryList.filter(val => {
          return val.countryId === this.users.countryId
        })
      }
      let newcurrencyList: Currency[] = [];
      if (this.livingCountry.length) {
        newcurrencyList = this.currencyList.filter(val => {
          return val.countryId === Number(this.livingCountry[0].countryId)
        })
      }
      this.userInfoPatch();
      this.getTurnOverList();

      this.userInfoForm.get('baseCurrency').setValue(newcurrencyList.length ? newcurrencyList[0] : null)
    });
  }

  userInfoPatch() {
    this.userInfoForm.patchValue({
      baseCurrency: '',
      countryCode: this.livingCountry[0] ? this.livingCountry[0] : null,
      organizationName: this.users.organizationName,
      organizationId: this.users.organizationId,
      firstName: this.users.firstName,
      lastName: this.users.lastName,
      email: this.users.email,
      contactNo: this.users.contactNo,
      roleId: this.users.roleId,
      turnOverId: this.users.TurnOverId,
      userId: this.users.userId,
      roleDescription: this.users.roleDescription,
      ssoId: this.users.ssoId,
      countryId: this.livingCountry[0] ? this.livingCountry[0].countryId : null,
      trade: '',
      profileUrl: '',
      orgPincode: '',
    })
  }

  getTurnOverList() {
    if (this.users.roleName !== "l3") {
      this._userService.getTurnOverList().then(res => {
        let callingCode = localStorage.getItem('callingCode')
        this.turnOverList = res.data.filter(data => {
          if (callingCode === '+91' && data.isInternational === 0) {
            return data
          }
          else if (callingCode !== '+91' && data.isInternational === 1) {
            return data
          }
        })
      })
    }
  }

  getTradesList() {
    this._userService.getTrades().then(res => {
      this.tradeList = res.data;
      if (res.data) {
        res.data.forEach(element => {
          if (element.tradeName == 'Others') {
            this.OthersId = element.tradeId;
          }
        });
      }
    })
  }

  formInit() {
    this.userInfoForm = this._formBuilder.group({
      baseCurrency: [{ value: '', disabled: this.permissionObj.rfqFlag ? false : true }],
      countryCode: [{ value: '', disabled: this.permissionObj.rfqFlag ? false : true }],
      organizationName: [],
      organizationId: [],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: this.countryCode !== "IN" ? true : false }, [Validators.required, Validators.pattern(FieldRegExConst.EMAIL)]],
      contactNo: [{ value: '', disabled: this.countryCode === "IN" ? true : false }],
      roleId: ['', Validators.required],
      turnOverId: [],
      userId: [],
      roleDescription: [{ value: '', disabled: true }],
      ssoId: [],
      countryId: [],
      trade: [],
      profileUrl: [''],
      orgPincode: ['', [Validators.max(999999), Validators.pattern(FieldRegExConst.POSITIVE_NUMBERS)]]
    });

    if (this.countryCode === "IN") {
      this.userInfoForm.get('contactNo').setValidators([Validators.required])
    }
    this.customTrade = this._formBuilder.group({
      trade: []
    })
    this.userInfoForm.get('countryCode').valueChanges.subscribe(country => {
      let newcurrencyList: Currency[] = [];
      if (country) {
        newcurrencyList = this.currencyList.filter(val => {
          return val.countryId === Number(country.countryId)
        })
      }
      this.countryId = newcurrencyList.length ? newcurrencyList[0].countryId : this.countryId;
      this.userInfoForm.get('baseCurrency').setValue(newcurrencyList.length ? newcurrencyList[0] : null)
    })
    this.userInfoForm.get('orgPincode').valueChanges.subscribe(val => {
      this.cityStateFetch(val)
    })
  }

  cityStateFetch(value) {
    this.commonService.getPincodeInternational(value, Number(this.countryId)).then(res => {
      if (res.data && res.data.length) {
        let city = res.data[0].districtName;
        let state = res.data[0].stateName;
        if (city && state)
          this.validPincode = true;
        else
          this.validPincode = false;

      }
      else {
        this.validPincode = false;
      }
    });
  }

  // checkPincode(): ValidatorFn {
  //   return (control: AbstractControl): Promise<any> | null => {
  //     return this.commonService.getPincodeInternational(control.value, Number(this.countryId)).then(res => {
  //       if (res.data && res.data.length) {
  //         let city = res.data[0].districtName;
  //         let state = res.data[0].stateName;
  //         if (city && state)
  //           return null;
  //         else
  //           return { 'pincodeInvalid': true };
  //       }
  //     });
  //   }
  // }

  changeSelected(parameter: string, trade: TradeList) {
    let choosenIndex = -1;
    this.selectedTrades.forEach((trades, index) => {
      if (trades.tradeId === trade.tradeId) {
        choosenIndex = index;
      }
    })
    if (choosenIndex >= 0) {
      this.selectedTrades.splice(choosenIndex, 1);
    } else {
      this.selectedTrades.push(trade);
      if (trade.tradeId === this.OthersId) {
        this.customTrade.get("trade").enable()
      }
      else {
        this.customTrade.get("trade").disable()
      }
    }
    this.selectedTradesId = this.selectedTrades.map((trades: TradeList) => trades.tradeId).flat()
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      const file = event.target.files[0];
      var fileSize = event.target.files[0].size; // in bytes
      let fileType = event.target.files[0].name.split('.').pop();

      if (this.fileTypes.some(element => {
        return element === fileType
      })) {
        if (fileSize < 1000000) {
          reader.onload = (event) => {
            this.localImg = (<FileReader>event.target).result;
          }
          this.imageFileSizeError = "";
          this.imageFileSizeCheck = true;
          this.uploadImage(file);
        }
        else {
          this.imageFileSizeCheck = false;
          this.imageFileSizeError = "Image must be less than 1 mb";
        }
      }
      else {
        this.localImg = '';
        this._snackBar.open("We don't support " + fileType + " in Image upload, Please uplaod pdf, doc, docx, jpeg, png", "", {
          duration: 2000,
          panelClass: ["success-snackbar"],
          verticalPosition: "bottom"
        });
      }
    }
  }

  uploadImage(file) {
    if (file) {
      const data = new FormData();
      data.append(`file`, file);
      return this._uploadImageService.postDocumentUpload(data).then(res => {
        this.userInfoForm.get('profileUrl').setValue(res.data.fileName);
        this.url = res.data.url;
      });
    }
  }


  submit() {
    if (this.userInfoForm.valid) {
      this.selectedTrades = this.selectedTrades.map((trade: TradeList) => {
        if (trade.tradeId === this.OthersId) {
          trade.tradeDescription = this.customTrade.value.trade;
        }
        return trade;
      })
      // this.commonService.setBaseCurrency(this.userInfoForm.value.baseCurrency)
      this.userInfoForm.get('trade').setValue([...this.selectedTrades]);
      // this.userInfoForm.value.tradeId = [...this.selectedTrades];
      let countryCode = null;
      if (this.users.roleName === "l3") {
        countryCode = this.userInfoForm.getRawValue().countryCode.callingCode
        localStorage.setItem("currencyCode", this.userInfoForm.getRawValue().baseCurrency.currencyCode);
      }
      else {
        countryCode = this.userInfoForm.value.countryCode.callingCode
        localStorage.setItem("currencyCode", this.userInfoForm.value.baseCurrency.currencyCode);
      }
      let organizationId = Number(this.userInfoForm.value.organizationId)
      let orgPincode = String(this.userInfoForm.value.orgPincode)
      const data: UserDetails = { ...this.userInfoForm.value, myAccountUpdate: true, orgPincode, countryCode, organizationId };
      this._userService.submitUserDetails(data).then(res => {
        this.navService.gaEvent({
          action: 'submit',
          category: 'Organisation_info',
          label: 'profile-completed',
          value: null
        });
        localStorage.setItem("userName", this.userInfoForm.value.firstName);
        if (this.url) {
          this._userService.UpdateProfileImage.next(this.url);
          localStorage.setItem('profileUrl', this.url);
        }
        if (this.users.roleName === 'l1')
          this._router.navigate(['profile/subscriptions']);
        // this._router.navigate([ 'profile/add-user' ]);
        else if (this.users.roleName != 'l1')
          this._router.navigate(['dashboard']);
      });
    }
  }

}