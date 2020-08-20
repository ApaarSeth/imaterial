import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { CountryCode } from '../../../shared/models/currency';
import { UserDetails } from '../../../shared/models/user-details';
import { WebNotificationService } from '../../../shared/services/webNotificationService.service';
import { TokenService } from '../../../shared/services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignInSignupService } from '../../../shared/services/signupSignin.service';
import { UserService } from '../../../shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppNavigationService } from '../../../shared/services/navigation.service';
import { FacebookPixelService } from '../../../shared/services/fb-pixel.service';
import { SignINDetailLists } from '../../../shared/models/signIn/signIn-detail-list';
import { FieldRegExConst } from '../../../shared/constants/field-regex-constants';
import { debounceTime } from 'rxjs/operators';
import { auth } from '../../../shared/models/auth';
import { AppNotificationService } from '../../../shared/services/app-notification.service';

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
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private notifier: AppNotificationService,
    private formBuilder: FormBuilder,
    private signInSignupService: SignInSignupService,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private navService: AppNavigationService,
    private fbPixel: FacebookPixelService,
  ) { }

  acceptTerms: boolean;
  signupForm: FormGroup;
  ipaddress: string;
  signInDetails = {} as SignINDetailLists;
  livingCountry: CountryCode[] = [];
  callingCode: string;
  locationCounter: number = 0;
  selectedCountry: CountryCode;
  ngOnInit() {
    this.countryList = this.actualCountryList;
    this.primaryCallingCode = localStorage.getItem('countryCode')
    this.route.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
      if (this.uniqueCode) {
        this.organisationDisabled = true;
        this.getUserInfo(this.uniqueCode);
      }
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


  setValidation() {
    let emailValidator = [
      Validators.required,
      Validators.pattern(FieldRegExConst.EMAIL),
      Validators.maxLength(50)
    ]
    if (this.callingCode === '+91') {
      this.signupForm.get('email').setValidators(emailValidator)
      this.signupForm.get('phone').setValidators([Validators.required, Validators.pattern(FieldRegExConst.PHONE_NUMBER), Validators.maxLength(50)])
      this.signupForm.get('otp').setValidators([Validators.required])
    }
    else {
      this.signupForm.get('email').setValidators([...emailValidator])
    }
  }

  getCountryCode(countryCode) {
    this.livingCountry = this.countryList.filter(val => {
      return val.countryCode.toLowerCase() === countryCode.toLowerCase();
    })
    this.signupForm.get('countryCode').setValue(this.livingCountry[0])
    this.selectedCountry = this.signupForm.get('countryCode').value;
  }

  getUserInfo(code) {
    this._userService.getUserInfoUniqueCode(code).then(res => {
      this.user = res.data;
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
      organisationName: [{ value: '', disabled: this.organisationDisabled }, [Validators.required, Validators.maxLength(50)]],
      organisationType: ["Contractor", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      otp: []
    });
    this.signupForm.get('email').valueChanges.pipe(debounceTime(30)).subscribe(data => {
      this.verifyEmail(data)
    })
  }


  collateSignupData() {
    this.signInDetails = {
      password: this.signupForm.value.password,
      confirmPassword: this.signupForm.value.password,
      phone: this.callingCode === '+91' ? this.signupForm.value.phone : null,
      email: this.signupForm.value.email,
      countryCode: this.callingCode === '+91' ? this.livingCountry[0].callingCode : null,
      loginIdType: this.callingCode === '+91' ? 'PHONE' : 'EMAIL',
      clientId: "fooClientIdPassword",
      customData: {
        uniqueCode: this.uniqueCode !== "" ? this.uniqueCode : null,
        countryCode: this.livingCountry[0].callingCode,
        countryId: String(this.livingCountry[0].countryId),
        organizationName: this.signupForm.value.organisationName,
        organizationType: this.signupForm.value.organisationType,
        organizationId: this.user ? this.user.organizationId.toString() : null,
        userId: this.user ? this.user.userId.toString() : null,
      }
    } as SignINDetailLists
    if (this.uniqueCode) {
      this.signInDetails.firstName = this.user.firstName ? this.user.firstName : null;
      this.signInDetails.lastName = this.user.lastName ? this.user.lastName : null;
    }
    return this.signInDetails
  }

  signup() {
    this.signInSignupService.signUp(this.collateSignupData()).then(data => {
      if (data.status === 1002) {
        this.notifier.snack(this.callingCode === "+91" ? "Phone Number already used" : "Email already used")
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
    if (!(/ipad|iphone|ipod/.test(window.navigator.userAgent.toLowerCase()))) {
      this.webNotificationService.subscribeToNotification();
    }
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
      this.notifier.snack("OTP has been sent on your phone number");
    });
  }

  enterOTP(event) {
    let countryCode = this.signupForm.get('countryCode').value.callingCode;
    const otp = event.target.value;
    if (event.target.value.length == 4) {
      this.signInSignupService.verifyOTP(this.signupForm.value.phone, countryCode, otp).then(res => {
        if (res.data) {
          this.lessOTPDigits = res.data.success;
        }
      });
    }
  }

  verifyMobile(mobile) {
    let countryCode = this.signupForm.get('countryCode').value.callingCode;
    this.signInSignupService.VerifyMobile(mobile, countryCode).then(res => {
      this.verifiedMobile = res.data;
      this.notifier.snack(res.message);
      if (this.verifiedMobile) {
        this.sendotp(mobile);
      }
    });
  }

  verifyEmail(email) {
    if (email.match(FieldRegExConst.EMAIL)) {
      this.signInSignupService.verifyEMAIL(this.signupForm.value.email).then(res => {
        if (res.statusCode === 201) {
          if (res && res.data) {
            this.emailVerified = res.data;
            this.emailEnteredCounter++;
            this.emailMessage = res.message;
          }
          else {
            this.emailEnteredCounter++;
            this.emailVerified = false;
          }
        }
        else {
          this.emailEnteredCounter++;
          this.emailVerified = false;
        }
      });
    }
  }
}
