import { CountryCode } from './../../../shared/models/currency';
import { OnInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRoles, UserDetails, TradeList, TurnOverList } from '../../../shared/models/user-details';
import { Currency, CountryCode } from '../../../shared/models/currency';
import { permission } from '../../../shared/models/permissionObject';
import { UserService } from '../../../shared/services/user.service';
import { PermissionService } from '../../../shared/services/permission.service';
import { CommonService } from '../../../shared/services/commonService';
import { DocumentUploadService } from '../../../shared/services/document-download.service';
import { AppNavigationService } from '../../../shared/services/navigation.service';
import { FieldRegExConst } from '../../../shared/constants/field-regex-constants';

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
  isPlanAvailable: any;
  userId: string;
  selectedCountry: CountryCode;
  selectedBaseCurrency: Currency

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
    this.userId = localStorage.getItem("userId");
    this.permissionObj = this.permissionService.checkPermission(this.role);
    this.isMobile = this.commonService.isMobile().matches;
    this.countryCode = localStorage.getItem('countryCode')
    this.countryId = Number(localStorage.getItem('countryId'));
    this.isPlanAvailable = Number(localStorage.getItem('isPlanAvailable'));
    this.formInit();
    this.getAllApi()
  }
  getAllApi() {
    let callingCode = localStorage.getItem('callingCode')
    Promise.all([this.role !== 'l3' ? this._userService.getRoles() : null
      , this.role !== 'l3' ? this._userService.getTurnOverList() : null,
    this.commonService.getCurrency(),
    this.commonService.getCountry(),
    this._userService.getUserInfo(this.userId),
    this._userService.getTrades()
    ]).then(res => {
      this.getUserRoles(res[0]);
      this.getTurnOverList(res[1]);
      this.getCurrency(res[2])
      this.getCountry(res[3])
      this.getUserInformation(res[4])
    })
  }

  getUserRoles(res) {
    this.roles = res.data;
    this.roles.splice(2, 1);
    const id = this.roles.filter(opt => opt.roleName === this.role);
    this.roleId = id.length && id[0].roleId;
  }

  getTurnOverList(res) {
    if (res) {
      let callingCode = localStorage.getItem('callingCode')
      this.turnOverList = res.data.filter(data => {
        if (callingCode === '+91' && data.isInternational === 0) {
          return data
        }
        else if (callingCode !== '+91' && data.isInternational === 1) {
          return data
        }
      })
    }
  }

  getCurrency(res) {
    this.currencyList = res.data;
  }

  getCountry(res) {
    this.countryList = res.data;
  }

  getUserInformation(res) {
    if (!localStorage.getItem('countryId')) {
      this.countryId = res.data.countryId;
      localStorage.setItem('countryId', res.data.countryId)
    }
    this.users = res.data ? res.data : null;
    localStorage.setItem('isPlanAvailable', this.users.isPlanAvailable);
    if (this.users.roleName === 'l1') {
      this.userInfoForm.controls.turnOverId.setValidators([Validators.required]);
      this.userInfoForm.controls.turnOverId.updateValueAndValidity();
    }
    this.userInfoPatch();
    this.setCountryAndCurrency()
  }

  setCountryAndCurrency() {
    this.livingCountry = this.countryList.filter(val => {
      return val.countryId === Number(this.users.countryId);
    })
    let newCurrencyList: Currency[] = [];
    newCurrencyList = this.currencyList.filter(val => {
      return val.currencyId === Number(this.livingCountry[0].countryId)
    })
    this.userInfoForm.get('baseCurrency').setValue(newCurrencyList[0])
    this.userInfoForm.get('countryCode').setValue(this.livingCountry[0])
    this.selectedCountry = this.userInfoForm.get('countryCode').value;
    this.selectedBaseCurrency = this.userInfoForm.get('baseCurrency').value;
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


  getTradesList(res) {
    this.tradeList = res.data;
    if (res.data) {
      res.data.forEach(element => {
        if (element.tradeName == 'Others') {
          this.OthersId = element.tradeId;
        }
      });
    }
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
    this.userInfoForm.get('baseCurrency').valueChanges.subscribe(currency => {
      this.selectedBaseCurrency = currency;
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
      this.selectedBaseCurrency = this.userInfoForm.get('baseCurrency').value;
      this.selectedCountry = country;
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

  changeSelected(trade: TradeList) {
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
      this.userInfoForm.get('trade').setValue([...this.selectedTrades]);
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
      const data: UserDetails = { ...this.userInfoForm.getRawValue(), myAccountUpdate: true, orgPincode, countryCode, organizationId };
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
        localStorage.setItem('isPlanAvailable', res.data.isPlanAvailable);
        localStorage.setItem('accountOwner', res.data.accountOwner);
        if (this.users.roleName === 'l1') {
          if (res.data.isPlanAvailable === 1) {
            this._router.navigate(['profile/subscriptions']);
          } else {
            this._router.navigate(['profile/add-user']);
          }
        }
        else if (this.users.roleName != 'l1') {
          this._router.navigate(['dashboard']);
        }
      });
    }
  }
}