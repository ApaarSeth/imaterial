import { OnInit, Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRoles, UserDetails, TradeList } from 'src/app/shared/models/user-details';
import { Router } from '@angular/router';
import { DocumentUploadService } from 'src/app/shared/services/document-download/document-download.service';
import { debug } from 'util';

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

  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _uploadImageService: DocumentUploadService) { }

  ngOnInit() {
    const userId = localStorage.getItem("userId");
    this.role = localStorage.getItem("role");
    this.getUserRoles();
    this.getUserInformation(userId);
    this.getTradesList();
  }

  getUserRoles() {
    this._userService.getRoles().then(res => {
      this.roles = res.data.reverse();
      this.roles.splice(2, 1);
      const id = this.roles.filter(opt => opt.roleName === this.role);
      this.roleId = id[0].roleId;
    })
  }

  getUserInformation(userId) {
    this._userService.getUserInfo(userId).then(res => {
      this.users = res.data ? res.data[0] : null;
      this.formInit();
    });
  }

  getTradesList() {
    this._userService.getTrades().then(res => {
      this.tradeList = res.data;
    })
  }

  formInit() {
    this.userInfoForm = this._formBuilder.group({
      organizationName: [this.users ? this.users.organizationName : ''],
      organizationId: [this.users ? this.users.organizationId : ''],
      firstName: [this.users ? this.users.firstName : '', Validators.required],
      lastName: [this.users ? this.users.lastName : '', Validators.required],
      email: [this.users ? this.users.email : '', Validators.required],
      contactNo: [this.users ? this.users.contactNo : '', Validators.required],
      roleId: [this.roleId ? this.roleId : null, Validators.required],
      userId: [this.users ? this.users.userId : null],
      ssoId: [this.users ? this.users.ssoId : null],
      country: ['India'],
      trade: [],
      profileUrl: [''],

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
      if (trade.tradeId === 22) {
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
      reader.onload = (event) => {
        this.localImg = (<FileReader>event.target).result;
      }
      const file = event.target.files[0];
      this.uploadImage(file);
    }
  }

  uploadImage(file) {
    if (file) {
      const data = new FormData();
      data.append(`file`, file);
      return this._uploadImageService.postDocumentUpload(data).then(res => {
        this.userInfoForm.get('profileUrl').setValue(res.data);
      });
    }
  }

  submit() {

    if (this.userInfoForm.valid) {
      this.selectedTrades = this.selectedTrades.map((trade: TradeList) => {
        if (trade.tradeId === 22) {
          trade.tradeDescription = this.customTrade.value.trade;
        }
        return trade;
      })
      this.userInfoForm.get('trade').setValue([...this.selectedTrades]);

      // this.userInfoForm.value.tradeId = [...this.selectedTrades];
      const data: UserDetails = this.userInfoForm.value;

      this._userService.submitUserDetails(data).then(res => {
        this._router.navigate(['profile/add-user']);
      });

    }
  }
}