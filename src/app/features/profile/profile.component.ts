import { orgTrades } from './../../shared/models/trades';
import { Component, OnInit } from "@angular/core";
import { UserRoles, UserDetails, TradeList, TurnOverList } from "../../shared/models/user-details";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Currency, CountryCode } from "../../shared/models/currency";
import { UserService } from "../../shared/services/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { CommonService } from "../../shared/services/commonService";
import { FieldRegExConst } from "../../shared/constants/field-regex-constants";
import { DocumentUploadService } from "../../shared/services/document-download.service";

export interface City {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {
  searchCountry: string = '';
  roles: UserRoles[];
  userInfoForm: FormGroup;
  customTrade: FormGroup;
  users: UserDetails;
  tradeList: TradeList[] = [];
  turnOverList: TurnOverList;
  selectedTrades: TradeList[] = [];
  localImg: string | ArrayBuffer;
  filename: string;
  role: string;
  roleId: number;
  cities: City[] = [
    { value: "Gurgaon", viewValue: "Gurgaon" },
    { value: "Delhi", viewValue: "Delhi" },
    { value: "Karnal", viewValue: "Karnal" }
  ];
  selectedTradesId: number[] = [];
  usersTrade: TradeList[] = [];
  OthersId: any;
  url: any;
  userId
  imageFileSizeError: string = "";
  imageFileSizeCheck: boolean = true;
  fileTypes: string[] = ['png', 'jpeg', 'jpg'];
  tradeDescription: string;
  currencyList: Currency[] = [];
  countryList: CountryCode[] = [];
  livingCountry: CountryCode[] = [];
  baseCurrency
  countryCode: string;
  validPincode: boolean = false;
  countryId: Number;
  isMobile: boolean = false;
  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private commonService: CommonService,
    private _uploadImageService: DocumentUploadService) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.userId = localStorage.getItem("userId");
    this.role = localStorage.getItem("role");
    this.countryId = Number(localStorage.getItem('countryId'))
    this.countryCode = localStorage.getItem('countryCode')
    this.formInit();
    this.getAllApi();
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
      this.getUserInformation(res[4], res[5])
    })
  }

  getUserRoles(res) {
    if (res) {
      this.roles = res.data;
      this.roles.splice(2, 1);
      const id = this.roles.filter(opt => opt.roleName === this.role);
      this.roleId = id[0].roleId;
    }
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

  getUserInformation(res, tradeRes) {
    this.users = res.data ? res.data : null;
    if (res.data.trade) {
      res.data.trade.forEach(element => {
        this.usersTrade.push(element);
        if (element.tradeId == 13) {
          if (element.tradeDescription)
            this.tradeDescription = element.tradeDescription;
          this.customTrade.patchValue({
            trade: element.tradeDescription
          })
        }
      });
      this.getTradesList(tradeRes);
    }
    this.userInfoPatch();
    this.setCountryAndCurrency()
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
      trade: this.users.trade,
      profileUrl: this.users.profileUrl,
      orgPincode: this.users.orgPincode,
    })
  }

  setCountryAndCurrency() {
    this.livingCountry = this.countryList.filter(val => {
      return val.countryId === Number(this.users.countryId);
    })
    let newCurrencyList = this.currencyList.filter(val => {
      return val.currencyId === this.users.baseCurrency.currencyId;
    })
    this.userInfoForm.get('baseCurrency').setValue(newCurrencyList[0])
    this.userInfoForm.get('countryCode').setValue(this.livingCountry[0])
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
    if (this.tradeList) {
      this.tradeList.forEach(element => {
        for (let i = 0; i < this.usersTrade.length; i++) {
          if (this.usersTrade[i].tradeId == element.tradeId) {
            element.selected = true;
            this.selectedTrades.push(element)
          }
        }
      });
    }
  }


  get selectedCountry() {
    return this.userInfoForm.get('countryCode').value;
  }

  get selectedBaseCurrency() {
    return this.userInfoForm.get('baseCurrency').value;
  }

  formInit() {
    this.userInfoForm = this._formBuilder.group({
      baseCurrency: [{ value: '', disabled: true }],
      countryCode: [{ value: '', disabled: true }],
      organizationName: [''],
      organizationId: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: this.users ? this.users.email : '', disabled: true }, Validators.required],
      contactNo: [{ value: '', disabled: this.countryCode === "IN" ? true : false }, Validators.required],
      roleId: ['', Validators.required],
      turnOverId: [],
      roleDescription: [],
      userId: [],
      ssoId: [],
      countryId: [],
      trade: [],
      profileUrl: [],
      orgPincode: ['', [Validators.max(999999), Validators.pattern(FieldRegExConst.POSITIVE_NUMBERS)]]
    });
    this.customTrade = this._formBuilder.group({
      trade: []
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
      // reader.onload = (event) => {
      //   this.localImg = (<FileReader>event.target).result;
      // }
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
        if (this.localImg)
          this.localImg = this.localImg;
        else if (this.users.profileUrl)
          this.localImg = this.localImg;

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
      let data: UserDetails = this.userInfoForm.getRawValue();
      data.myAccountUpdate = false;
      if (data.profileUrl.includes('https')) {
        let tempIndex = data.profileUrl.indexOf('tmp')
        let quesIndex = data.profileUrl.indexOf('?')
        let re = /\%20/gi;
        let fileName = (<String>data.profileUrl.slice(tempIndex, quesIndex)).replace(re, " ");
        data.profileUrl = fileName;
      }

      data.trade = [...this.selectedTrades];
      data.countryCode = this.userInfoForm.getRawValue().countryCode.callingCode
      data.countryId = this.userInfoForm.getRawValue().countryCode.countryId
      data.orgPincode = String(this.userInfoForm.value.orgPincode)
      this._userService.submitUserDetails(data).then(res => {
        if (this.url) {
          this._userService.UpdateProfileImage.next(this.url);
          localStorage.setItem('profileUrl', this.url);
        }
        this._router.navigate(['dashboard']);
      });

    }
  }
  redirectToDashboard() {
    this._router.navigate(['/dashboard']);
  }
}