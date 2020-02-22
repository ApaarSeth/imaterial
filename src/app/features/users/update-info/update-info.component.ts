import { OnInit, Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRoles, UserDetails, TradeList } from 'src/app/shared/models/user-details';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { Router } from '@angular/router';

export interface City {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html'
})

export class UpdateInfoComponent implements OnInit {

  roles: UserRoles;
  userInfoForm: FormGroup;
  users: UserDetails;
  tradeList: TradeList;
  selectedTrades: any[] = [];

  cities: City[] = [
    { value: "Gurgaon", viewValue: "Gurgaon" },
    { value: "Delhi", viewValue: "Delhi" },
    { value: "Karnal", viewValue: "Karnal" }
  ];

  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router) { }

  ngOnInit() {
    const userId = localStorage.getItem("userId");
    this.getUserRoles();
    this.getUserInformation(userId);
    this.getTradesList();
  }

  getUserRoles() {
    this._userService.getRoles().then(res => {
      this.roles = res.data;
    })
  }

  getUserInformation(userId) {
    this._userService.getUserInfo(userId).then(res => {
      this.users = res.data ? res.data[0] : null;
      this.formInit();
    });
  }

  getTradesList(){
    this._userService.getTrades().then(res => {
      this.tradeList = res.data;
    })
  }

  formInit() {
    this.userInfoForm = this._formBuilder.group({
      organizationName: [this.users ? this.users.organizationName : ''],
      organizationId: [this.users ? this.users.organizationId : ''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [this.users ? this.users.email : '', Validators.required],
      contactNo: [this.users ? this.users.contactNo : '', Validators.required],
      roleId: ['', Validators.required],
      userId: [this.users ? this.users.userId : null],
      ssoId: [this.users ? this.users.ssoId : null],
      country: ['India'],

      tradeId: [''],

      addressLine1: ['', Validators.required],
      addressLine2: [''],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pinCode: ['', {
        validators: [
          Validators.required,
          Validators.pattern(FieldRegExConst.PINCODE)
        ]
      }],
      
      pan: ['', Validators.required],
      gstNo: ['', {
        validators: [
          Validators.required,
          Validators.pattern(FieldRegExConst.GSTIN)
        ]
      }],

      profileUrl: ['']

    })
  }

  changeSelected(parameter: string, query: string) {
    const index = this.selectedTrades.indexOf(query);
    if (index >= 0) {
      this.selectedTrades.splice(index, 1);
    } else {
      this.selectedTrades.push(query);
    }
    // console.log(this.selectedTrades);
  }

  submit(){

    if(this.userInfoForm.valid){
      
      this.userInfoForm.value.tradeId = [...this.selectedTrades];
      const data: UserDetails = this.userInfoForm.value;

      this._userService.submitUserDetails(data).then(res => {
         console.log(this.userInfoForm);
        this._router.navigate(['users/organisation/add-user']); 
      });

    }
  }
}