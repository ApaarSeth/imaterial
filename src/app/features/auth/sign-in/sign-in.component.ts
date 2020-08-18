import { CountryCode } from './../../../shared/models/currency';
import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SwPush, SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FieldRegExConst } from '../../../shared/constants/field-regex-constants';
import { TokenService } from '../../../shared/services/token.service';
import { WebNotificationService } from '../../../shared/services/webNotificationService.service';
import { UserService } from '../../../shared/services/user.service';
import { DataService } from '../../../shared/services/data.service';
import { AppNavigationService } from '../../../shared/services/navigation.service';
import { CommonService } from '../../../shared/services/commonService';
import { VisitorService } from '../../../shared/services/visitor.service';
import { GlobalLoaderService } from '../../../shared/services/global-loader.service';
import { API } from '../../../shared/constants/configuration-constants';
import { SignInSignupService } from '../../../shared/services/signupSignin.service';
import { SignInData } from '../../../shared/models/signIn/signIn-detail-list';


@Component({
  selector: "signin",
  templateUrl: "./sign-in.component.html"
})

export class SigninComponent implements OnInit {
  @Input("callingCode") actualCallingCode: string;
  @Input("countryCode") countryCode: string;
  @Input("countryList") actualCountryList: CountryCode[];


  // isEnabled = this.swPush.isEnabled;
  // isGranted = Notification.permission === 'granted';

  constructor(private tokenService: TokenService, private router: Router,
    private webNotificationService: WebNotificationService,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private signInSignupService: SignInSignupService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _userService: UserService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private navigationService: AppNavigationService,
    private commonService: CommonService,
    private visitorsService: VisitorService,
    private loader: GlobalLoaderService) { }

  ipaddress: string;
  emailVerified: boolean = true;
  emailMessage: string;
  uniqueCode: string = "";
  loginCountry: string = "";
  livingCountry: CountryCode[] = [];
  showPassWordString: boolean = false;
  signinForm: FormGroup;
  signInData = {} as SignInData;
  acceptTerms: boolean;
  countryList: CountryCode[] = [];
  searchCountry: string = '';
  primaryCallingCode: string = '';
  callingCode: string;
  selectedCountry: CountryCode;
  ngOnInit() {
    this.route.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.actualCountryList && changes.actualCountryList.currentValue) {
      this.formInit();
      this.countryList = changes.actualCountryList.currentValue;
    }
    if (changes.actualCallingCode && changes.actualCallingCode.currentValue) {
      this.callingCode = changes.actualCallingCode.currentValue;
      this.setValidation();
    }
    if (changes.countryCode && changes.countryCode.currentValue) {
      this.getCountryCode(changes.countryCode.currentValue)
    }
  }
  formInit() {
    this.signinForm = this.formBuilder.group({
      countryCode: [{ value: '', disabled: true }],
      phone: [""],
      password: ["", Validators.required],
      email: [''],
    });
  }

  setValidation() {
    let emailValidator = [
      Validators.required,
      Validators.pattern(FieldRegExConst.EMAIL)
    ]
    if (this.callingCode === '+91') {
      this.signinForm.get('phone').setValidators([Validators.required, Validators.pattern(FieldRegExConst.MOBILE2)])
    }
    else {
      this.signinForm.get('email').setValidators(emailValidator)
    }
  }

  getCountryCode(countryCode) {
    this.livingCountry = this.countryList.filter(val => {
      return val.countryCode.toLowerCase() === countryCode.toLowerCase();
    })
    this.signinForm.get('countryCode').setValue(this.livingCountry[0])
    this.selectedCountry = this.signinForm.get('countryCode').value
  }

  signin() {
    let params = new URLSearchParams();
    params.append("loginIdType", this.callingCode === '+91' ? 'PHONE' : 'EMAIL');
    this.callingCode === '+91' ? params.append('countryCode', this.callingCode) : null;
    params.append("username", this.callingCode === '+91' ? this.signinForm.value.phone : this.signinForm.value.email);
    params.append("password", this.signinForm.value.password);
    params.append("grant_type", "password");
    params.append("client_id", "fooClientIdPassword");
    params.append("userType", "BUYER");

    this.signInSignupService.signIn(params.toString()).then(data => {
      if (data.errorMessage) {
        this._snackBar.open(data.errorMessage, "", {
          duration: 2000,
          panelClass: ["warning-snackbar"],
          verticalPosition: "bottom"
        });
      }
      else if (data.serviceRawResponse.data) {
        if (!(/ipad|iphone|ipod/.test(window.navigator.userAgent.toLowerCase()))) {
          this.subscribeNotification()
        }
        this.tokenService.setAuthResponseData(data.serviceRawResponse.data)
        if (localStorage.countryCode !== 'IN' && localStorage.getItem('accountStatus') && !Number(localStorage.getItem('accountStatus'))) {
          this.router.navigate(["/profile/email-verification"]);
        }
        else {
          this.getUserInfo(data.serviceRawResponse.data.userId);
        }
        this.navigationService.gaTag({ action: 'event', command: 'login', options: { 'method': this.tokenService.getOrgId() } })
      }
    });
  }

  subscribeNotification() {
    this.webNotificationService.subscribeToNotification();
  }

  /**
   * 
   * @param userId Logged in user Id
   * @description Function will get the data of logged in user
   */
  getUserInfo(userId) {
    this.dataService.getRequest(API.GET_USER_PROFILE(userId), null).then(res => {
      localStorage.setItem("userName", res.data[0].firstName);
      localStorage.setItem("profileUrl", res.data[0].profileUrl);
      localStorage.setItem("currencyCode", res.data[0].baseCurrency ? res.data[0].baseCurrency.currencyCode : null);
      localStorage.setItem("countryId", res.data[0].countryId);
      localStorage.setItem("isPlanAvailable", res.data[0].isPlanAvailable);
      localStorage.setItem('isFreeTrialSubscription', res.data[0].isFreeTrialSubscription);
      localStorage.setItem('isActiveSubscription', res.data[0].isActiveSubscription);
      localStorage.setItem('accountOwner', res.data[0].accountOwner);
      this.dataService.getRequest(API.CHECKTERMS, null).then(res => {
        this.acceptTerms = res.data;
        if (!this.acceptTerms) {
          this.router.navigate(["/profile/terms-conditions"]);
        }
        else {
          this.router.navigate(["/dashboard"]);
        }
      })
    })
  }

  showPassWord() {
    if (!this.showPassWordString) {
      this.showPassWordString = true;
    } else {
      this.showPassWordString = false;
    }
  }

  goToForgetPass() {
    if (this.uniqueCode) {
      this.router.navigate(['auth/forgot-password/' + this.uniqueCode]);
    }
    else {
      this.router.navigate(['auth/forgot-password']);
    }
  }

}