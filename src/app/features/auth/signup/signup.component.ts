import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SignINDetailLists } from "../../../shared/models/signIn/signIn-detail-list";
import { SignInSignupService } from "src/app/shared/services/signupSignin/signupSignin.service";
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { FieldRegExConst } from "src/app/shared/constants/field-regex-constants";
import { UserService } from "src/app/shared/services/userDashboard/user.service";
import { UserDetails } from 'src/app/shared/models/user-details';
import { MatSnackBar } from '@angular/material';
import { TokenService } from 'src/app/shared/services/token.service';
import { auth } from 'src/app/shared/models/auth';
import { debounceTime } from 'rxjs/operators';
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { FacebookPixelService } from 'src/app/shared/services/fb-pixel.service';
import { DataService } from 'src/app/shared/services/data.service';
import { API } from 'src/app/shared/constants/configuration-constants';
import { CommonService } from 'src/app/shared/services/commonService';
import { CountryCode } from 'src/app/shared/models/currency';
import { VisitorService } from 'src/app/shared/services/visitor.service';
import { WebNotificationService } from 'src/app/shared/services/webNotificationService.service';
import { SwPush, SwUpdate } from '@angular/service-worker';

export interface OrganisationType {
  value: string;
  viewValue: string;
}

@Component({
  selector: "signup",
  templateUrl: "./signup.component.html"
})

export class SignupComponent implements OnInit {
  @Input("callingCode") actualCallingCode: string;
  @Input("countryCode") countryCode: string;
  @Input("countryList") actualCountryList: CountryCode[]

  showPassWordString: boolean = false;
  uniqueCode: string = "";
  user: UserDetails;
  lessOTPDigits: boolean = false;
  showOtp: boolean = false;
  emailVerified: boolean = false;
  emailEnteredCounter: number = 0;
  emailMessage: string;
  otpLength: number = 0;
  verifiedMobile: boolean = false;
  value: any;
  organisationDisabled: boolean = false;
  searchCountry: string = '';
  countryList: CountryCode[] = [];
  primaryCallingCode: string = '';
  constructor(
    private webNotificationService: WebNotificationService,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private signInSignupService: SignInSignupService,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private navService: AppNavigationService,
    private fbPixel: FacebookPixelService,
    private dataService: DataService,
    private commonService: CommonService,
    private visitorsService: VisitorService,
    private activatedRoute: ActivatedRoute
  ) { }
  acceptTerms: boolean;
  signupForm: FormGroup;
  ipaddress: string;
  signInDetails = {} as SignINDetailLists;
  livingCountry: CountryCode[] = [];
  callingCode: string;
  locationCounter: number = 0;

  ngOnInit() {
    this.countryList = this.activatedRoute.snapshot.data.countryList;
    // this.countryList = this.actualCountryList;
    this.primaryCallingCode = localStorage.getItem('countryCode')
    this.route.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
      this.callingCode = this.actualCallingCode
      this.formInit();
      if (this.uniqueCode) {
        this.organisationDisabled = true;
        this.getUserInfo(this.uniqueCode);
      }
      if (this.callingCode) {
        this.getLocation();
      }
    });
  }




  get selectedCountry() {
    return this.signupForm.get('countryCode').value;
  }


  getLocation() {
    let emailValidator = [
      Validators.required,
      Validators.pattern(FieldRegExConst.EMAIL)
    ]
    if (this.callingCode === '+91') {
      this.signupForm.get('email').setValidators(emailValidator)
      this.signupForm.get('phone').setValidators([Validators.required])
      this.signupForm.get('otp').setValidators([Validators.required])
    }
    else {
      this.signupForm.get('email').setValidators([...emailValidator])
    }
    this.getCountryCode(this.callingCode, this.countryCode)
  }

  getCountryCode(callingCode, countryCode) {
    this.livingCountry = this.countryList.filter(val => {
      if (callingCode === '+1') {
        if (val.callingCode === callingCode && val.countryCode === countryCode)
          return val;
      } else {
        return val.callingCode === callingCode;
      }
    })
    this.signupForm.get('countryCode').setValue(this.livingCountry[0])
  }

  getUserInfo(code) {
    this._userService.getUserInfoUniqueCode(code).then(res => {
      this.user = res.data[0];
      if (res.data[0].firstName)
        localStorage.setItem("userName", res.data[0].firstName);
      if (this.user.email) {
        this.verifyEmail(this.user.email)
      }
      this.signupForm.setValue({
        countryCode: this.signupForm.get('countryCode').value,
        email: this.user ? this.user.email : '',
        phone: this.user ? this.user.contactNo : '',
        organisationName: this.user ? this.user.companyName : '',
        organisationType: "Contractor",
        password: "",
        otp: ""
      });
    });
  }

  organisationTypes: OrganisationType[] = [
    { value: "Contractor", viewValue: "Contractor" },
    { value: "Supplier", viewValue: "Supplier" }
  ];

  formInit() {
    this.signupForm = this.formBuilder.group({
      countryCode: [{ value: '', disabled: true }],
      email: [],
      phone: [],
      organisationName: [{ value: '', disabled: this.organisationDisabled }, Validators.required],
      organisationType: ["Contractor", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      otp: []
    });

    this.signupForm.get('email').valueChanges.subscribe(data => {
      this.verifyEmail(data)
    })
    this.signupForm.get('phone').valueChanges.subscribe(data => {

    })
  }

  signup() {
    this.signInDetails.password = this.signupForm.value.password;
    this.signInDetails.confirmPassword = this.signupForm.value.password;
    this.signInDetails.phone = this.callingCode === '+91' ? this.signupForm.value.phone : null;
    this.signInDetails.email = this.signupForm.value.email;
    this.signInDetails.countryCode = this.callingCode === '+91' ? this.livingCountry[0].callingCode : null;
    this.signInDetails.loginIdType = this.callingCode === '+91' ? 'PHONE' : 'EMAIL';
    this.signInDetails.clientId = "fooClientIdPassword";
    if (this.uniqueCode) {
      this.signInDetails.firstName = this.user.firstName ? this.user.firstName : null;
      this.signInDetails.lastName = this.user.lastName ? this.user.lastName : null;
    }
    this.signInDetails.customData = {
      uniqueCode: this.uniqueCode !== "" ? this.uniqueCode : null,
      countryCode: this.livingCountry[0].callingCode,
      countryId: String(this.livingCountry[0].countryId),
      organizationName: this.signupForm.value.organisationName,
      organizationType: this.signupForm.value.organisationType,
      organizationId: this.user ? this.user.organizationId.toString() : null,
      userId: this.user ? this.user.userId.toString() : null,
    };

    this.signInSignupService.signUp(this.signInDetails).then(data => {
      if (data.status === 1002) {
        this._snackBar.open(this.callingCode === "+91" ? "Phone Number already used" : "Email already used", "", {
          duration: 2000,
          panelClass: ["warning-snackbar"],
          verticalPosition: "bottom"
        });
      }
      else if (data.data.serviceRawResponse.data as auth) {
        this.subscribeNotification()
        this.tokenService.setAuthResponseData(data.data.serviceRawResponse.data)
        this.fbPixel.fire('Lead')
        this.fbPixel.fire('PageView')
        this.navService.gaEvent({
          action: 'submit',
          category: 'Signup_successfully',
          label: this.signInDetails.email,
          value: null
        });
        // localStorage.setItem("role", data.data.serviceRawResponse.data.role);
        // localStorage.setItem("accessToken", data.data.serviceRawResponse.data.serviceToken);
        // localStorage.setItem("userId", data.data.serviceRawResponse.data.userId);
        // localStorage.setItem("orgId", data.data.serviceRawResponse.data.orgId);

        // if (data.data.serviceRawResponse.data.role || this.uniqueCode !== "") {this
        if (this.uniqueCode) {
          localStorage.setItem("uniqueCode", this.uniqueCode);
        }

        if (localStorage.getItem('accountStatus') && Number(localStorage.getItem('accountStatus')) === 0) {
          this.router.navigate(["/profile/email-verification"]);
        }
        else {
          this.signInSignupService.checkTerms().then(res => {
            this.acceptTerms = res.data;
            if (!this.acceptTerms) {
              this.router.navigate(["/profile/terms-conditions"]);
            }
            else {
              this.router.navigate(["/profile/update-info"]);
            }
          })
        }
      }
    });
  }

  subscribeNotification() {
    this.webNotificationService.subscribeToNotification()
    // if (this.swUpdate.isEnabled) {
    //   this.swUpdate.available.subscribe(() => {
    //     if (confirm("New version available. Load New Version?")) {
    //       window.location.reload();
    //     }
    //   });
    // }
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      window.open(notification.data.url)
    })
  }

  showPassWord() {
    if (!this.showPassWordString) {
      this.showPassWordString = true;
    } else {
      this.showPassWordString = false;
    }
  }

  sendOtpBtn() {
    this.value = this.signupForm.get('phone').value;
    if (!this.uniqueCode) {
      this.verifyMobile(this.value);
    }
    if ((this.uniqueCode) && (this.user.contactNo == this.value)) {
      this.sendotp(this.value);
    }
    else if ((this.uniqueCode) && (this.user.contactNo != this.value)) {
      this.verifyMobile(this.value);
    }
  }

  sendotp(value) {
    let countryCode = this.signupForm.get('countryCode').value.callingCode;
    this.signInSignupService.sendOTP(value, countryCode).then(res => {
      if (res.data)
        this.showOtp = res.data.success;
      this._snackBar.open("OTP has been sent on your phone number", "", {
        duration: 2000,
        panelClass: ["success-snackbar"],
        verticalPosition: "bottom"
      });

    });
  }

  verifyMobile(mobile) {
    let countryCode = this.signupForm.get('countryCode').value.callingCode;
    this.signInSignupService.VerifyMobile(mobile, countryCode).then(res => {
      this.verifiedMobile = res.data;
      this._snackBar.open(res.message, "", {
        duration: 2000,
        panelClass: ["success-snackbar"],
        verticalPosition: "bottom"
      });
      if (this.verifiedMobile) {
        this.sendotp(mobile);
      }
    });
  }
  enterOTP(event) {
    let countryCode = this.signupForm.get('countryCode').value.callingCode;
    const otp = event.target.value;
    if (event.target.value.length == 4) {
      //this.otpLength = event.target.value.length;
      this.signInSignupService.verifyOTP(this.signupForm.value.phone, countryCode, otp).then(res => {
        if (res.data) {
          this.lessOTPDigits = res.data.success;
        }
      });
    }
  }

  verifyEmail(email) {
    if (email.match(FieldRegExConst.EMAIL)) {
      this.signInSignupService.verifyEMAIL(this.signupForm.value.email).then(res => {
        if (res) {
          this.emailEnteredCounter++;
          this.emailVerified = res.data;
          this.emailMessage = res.message;
        }
      });
    } else {
      this.emailEnteredCounter++;
      this.emailVerified = false;
    }
  }
}
