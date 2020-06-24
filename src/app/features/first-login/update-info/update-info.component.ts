import { OnInit, Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  imageFileSize: boolean = false;
  fileTypes: string[] = [ 'png', 'jpeg', 'jpg' ];
  currencyList: Currency[] = [];
  countryList: CountryCode[] = [];
  livingCountry: CountryCode[] = [];
  permissionObj: permission;
  isMobile: boolean;
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
    this.formInit();
    this.getUserRoles();
    this.getTradesList();
    this.getTurnOverList();
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
      this.roleId = id[ 0 ].roleId;
    })
  }

  getUserInformation(userId) {
    this._userService.getUserInfo(userId).then(res => {
      this.users = res.data ? res.data[ 0 ] : null;
      if (this.users.roleName === 'l1') {
        this.userInfoForm.controls.turnOverId.setValidators([ Validators.required ]);
        this.userInfoForm.controls.turnOverId.updateValueAndValidity();
      }
      if (this.countryList) {
        this.livingCountry = this.countryList.filter(val => {
          return val.countryId === this.users.countryId
        })
      }
      this.formInit();
      this.userInfoForm.get('countryCode').setValue(this.livingCountry[ 0 ])
      this.userInfoForm.get('countryId').setValue(this.livingCountry[ 0 ] ? this.livingCountry[ 0 ].countryId : null)
    });
  }
  getTurnOverList() {
    this._userService.getTurnOverList().then(res => {
      this.turnOverList = res.data;
    })
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
      baseCurrency: [ { value: '', disabled: this.permissionObj.rfqFlag ? false : true } ],
      countryCode: [ { value: '', disabled: this.permissionObj.rfqFlag ? false : true } ],
      organizationName: [ this.users ? this.users.organizationName : '' ],
      organizationId: [ this.users ? this.users.organizationId : '' ],
      firstName: [ this.users ? this.users.firstName : '', Validators.required ],
      lastName: [ this.users ? this.users.lastName : '', Validators.required ],
      email: [ this.users ? this.users.email : '', [ Validators.required, Validators.pattern(FieldRegExConst.EMAIL) ] ],
      contactNo: [ this.users ? this.users.contactNo : '', [ Validators.required ] ],
      roleId: [ this.users ? this.users.roleId : null, Validators.required ],
      turnOverId: [ this.users ? this.users.TurnOverId : null ],
      userId: [ this.users ? this.users.userId : null ],
      roleDescription: [ { value: this.users ? this.users.roleDescription : null, disabled: true } ],
      ssoId: [ this.users ? this.users.ssoId : null ],
      countryId: [],
      trade: [],
      profileUrl: [ '' ],
      orgPincode: [ '', Validators.maxLength(6) ]
      // addressLine1: ['', Validators.required],
      // addressLine2: [''],
      // state: ['', Validators.required],
      // city: ['', Validators.required],
      // pinCode: ['', {
      //   validators: [
      //     Validators.required,
      //     Validators.pattern(FieldRegExConst.PINCODE)
      //   ]
      // }],
      // pan: [''],
      // gstNo: [''],
      // file: ['']
    });
    this.customTrade = this._formBuilder.group({
      trade: []
    })

    this.userInfoForm.get('countryCode').valueChanges.subscribe(country => {
      let newcurrencyList: Currency[] = [];
      if (country) {
        newcurrencyList = this.currencyList.filter(val => {
          return val.countryId === country.countryId
        })
      }

      this.userInfoForm.get('baseCurrency').setValue(newcurrencyList.length ? newcurrencyList[ 0 ] : null)
    })

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
      reader.readAsDataURL(event.target.files[ 0 ]);
      // reader.onload = (event) => {
      //   this.localImg = (<FileReader>event.target).result;
      // }
      const file = event.target.files[ 0 ];
      var fileSize = event.target.files[ 0 ].size; // in bytes
      let fileType = event.target.files[ 0 ].name.split('.').pop();

      if (this.fileTypes.some(element => {
        return element === fileType
      })) {
        if (fileSize < 1000000) {
          reader.onload = (event) => {
            this.localImg = (<FileReader>event.target).result;
          }
          this.imageFileSizeError = "";
          this.imageFileSize = true;
          this.uploadImage(file);
        }
        else {
          this.imageFileSize = false;
          this.imageFileSizeError = "Image must be less than 1 mb";
        }
      }
      else {
        this.localImg = '';
        this._snackBar.open("We don't support " + fileType + " in Image upload, Please uplaod pdf, doc, docx, jpeg, png", "", {
          duration: 2000,
          panelClass: [ "success-snackbar" ],
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
      this.userInfoForm.get('trade').setValue([ ...this.selectedTrades ]);
      // this.userInfoForm.value.tradeId = [...this.selectedTrades];
      let countryCode = this.userInfoForm.value.countryCode.callingCode
      let organizationId = Number(this.userInfoForm.value.organizationId)
      const data: UserDetails = { ...this.userInfoForm.value, countryCode, organizationId };
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
          this._router.navigate([ 'profile/add-user' ]);
        else if (this.users.roleName != 'l1')
          this._router.navigate([ 'dashboard' ]);
      });
    }
  }
}