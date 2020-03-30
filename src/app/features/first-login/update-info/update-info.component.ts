import { OnInit, Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRoles, UserDetails, TradeList, TurnOverList } from 'src/app/shared/models/user-details';
import { Router } from '@angular/router';
import { DocumentUploadService } from 'src/app/shared/services/document-download/document-download.service';
import { debug } from 'util';
import { AppNavigationService } from 'src/app/shared/services/navigation.service';

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


  cities: City[] = [
    { value: "Gurgaon", viewValue: "Gurgaon" },
    { value: "Delhi", viewValue: "Delhi" },
    { value: "Karnal", viewValue: "Karnal" }
  ];
  selectedTradesId: number[] = [];
  url: string;
  OthersId: number;

  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _uploadImageService: DocumentUploadService,
    private navService: AppNavigationService) { }

  ngOnInit() {
    const userId = localStorage.getItem("userId");
    this.role = localStorage.getItem("role");
    this.getUserRoles();
    this.getUserInformation(userId);
    this.getTradesList();
    this.getTurnOverList();
  }

  getUserRoles() {
    this._userService.getRoles().then(res => {
      this.roles = res.data;
      this.roles.splice(2, 1);
      const id = this.roles.filter(opt => opt.roleName === this.role);
      this.roleId = id[0].roleId;
    })
  }

  getUserInformation(userId) {
    this._userService.getUserInfo(userId).then(res => {
      this.users = res.data ? res.data[0] : null;
      this.formInit();
      if(this.users.roleName === 'l1')
       {
           this.userInfoForm.controls.turnOverId.setValidators([Validators.required]);
         this.userInfoForm.controls.turnOverId.updateValueAndValidity();
       }
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
      if(res.data){
        res.data.forEach(element => {
          if(element.tradeName == 'Others'){
            this.OthersId = element.tradeId; 
          }
      });
      }
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
      roleId: [this.users ? this.users.roleId : null, Validators.required],
      turnOverId: [this.users ? this.users.TurnOverId : null],
      userId: [this.users ? this.users.userId : null],
      roleDescription: [{value : this.users ? this.users.roleDescription : null,disabled : true}],
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

      // this.userInfoForm.value.tradeId = [...this.selectedTrades];
      const data: UserDetails = this.userInfoForm.value;

      this._userService.submitUserDetails(data).then(res => {
        this.navService.gaEvent({
          action: 'submit',
          category: 'Organisation_info',
          label: 'profile-completed',
          value: null
        });

        localStorage.setItem("userName",this.userInfoForm.value.firstName);
        if(this.url){
           localStorage.setItem("companyImage",this.url);
        }

        if (this.users.roleName === 'l1')
          this._router.navigate(['profile/add-user']);
        else if (this.users.roleName != 'l1')
          this._router.navigate(['dashboard']);
      });

    }
  }
}