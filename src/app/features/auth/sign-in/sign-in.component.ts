import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { SignInSignupService } from "src/app/shared/services/signupSignin/signupSignin.service";
import { SignInData } from "src/app/shared/models/signIn/signIn-detail-list";
import { Router, ActivatedRoute, Navigation, ActivatedRouteSnapshot } from "@angular/router";
import { FieldRegExConst } from "src/app/shared/constants/field-regex-constants";
import { UserService } from "src/app/shared/services/userDashboard/user.service";
import { MatSnackBar } from '@angular/material';
import { TokenService } from 'src/app/shared/services/token.service';
import { DataService } from 'src/app/shared/services/data.service';
import { API } from 'src/app/shared/constants/configuration-constants';
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { CountryCode } from 'src/app/shared/models/currency';
import { VisitorService } from 'src/app/shared/services/visitor.service';
import { GlobalLoaderService } from 'src/app/shared/services/global-loader.service';
import { WebNotificationService } from 'src/app/shared/services/webNotificationService.service';
import { SwPush, SwUpdate } from '@angular/service-worker';


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

  ngOnInit() {
    // this.countryList = this.activatedRoute.snapshot.data.countryList;
    this.countryList = this.actualCountryList;
    this.route.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
    });
    this.callingCode = this.actualCallingCode
    this.formInit();
    if (this.callingCode) {
      this.getLocation();
    }
  }

  getLocation() {
    let emailValidator = [
      Validators.required,
      Validators.pattern(FieldRegExConst.EMAIL)
    ]
    this.getCountryCode(this.callingCode, this.countryCode)
    if (this.callingCode === '+91') {
      // this.signinForm.get('email').setValidators(emailValidator)
      this.signinForm.get('phone').setValidators([Validators.required])
    }
    else {
      this.signinForm.get('email').setValidators(emailValidator)

    }
  }

  getCountryCode(callingCode, countryCode) {
    this.livingCountry = this.countryList.filter(val => {
      // if (callingCode === '+1') {
      //   if (val.callingCode === callingCode && val.countryCode === countryCode)
      //     return val;
      // }
      return val.countryCode.toLowerCase() === countryCode.toLowerCase();
    })
    this.signinForm.get('countryCode').setValue(this.livingCountry[0])
  }

  formInit() {
    this.signinForm = this.formBuilder.group({
      countryCode: [{ value: '', disabled: true }],
      phone: [""],
      password: ["", Validators.required],
      email: [''],
    });
  }

  get selectedCountry() {
    return this.signinForm.get('countryCode').value;
  }

  signin() {
    this.loader.show()
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
        this.loader.hide()
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
        if (localStorage.getItem('accountStatus') && !Number(localStorage.getItem('accountStatus'))) {
          this.router.navigate(["/profile/email-verification"]);
          this.loader.hide()
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
    this.dataService.getRequest(API.GET_USER_PROFILE(userId), null, { skipLoader: true }).then(res => {
      if (res.data[0].firstName)
        localStorage.setItem("userName", res.data[0].firstName);
      localStorage.setItem("profileUrl", res.data[0].profileUrl);
      localStorage.setItem("currencyCode", res.data[0].baseCurrency ? res.data[0].baseCurrency.currencyCode : null);
      // localStorage.setItem("countryCode", res.data[0].countryCode);
      localStorage.setItem("countryId", res.data[0].countryId);
      localStorage.setItem("isActiveSubscription", res.data[0].isActiveSubscription);
      this.dataService.getRequest(API.CHECKTERMS, null, { skipLoader: true }).then(res => {
        this.acceptTerms = res.data;
        if (!this.acceptTerms) {
          this.router.navigate(["/profile/terms-conditions"]);
        }
        else {
          this.router.navigate(["/profile/update-info"]);
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