import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserDetails } from "../../../shared/models/user-details";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ForgetPassDetails } from "../../../shared/models/signIn/signIn-detail-list";
import { CountryCode } from "../../../shared/models/currency";
import { TokenService } from "../../../shared/services/token.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SignInSignupService } from "../../../shared/services/signupSignin.service";
import { UserService } from "../../../shared/services/user.service";
import { AppNavigationService } from "../../../shared/services/navigation.service";
import { CommonService } from "../../../shared/services/commonService";
import { VisitorService } from "../../../shared/services/visitor.service";
import { FieldRegExConst } from "../../../shared/constants/field-regex-constants";
import { OrganisationType } from "../sign-in-sign-up/sign-in-sign-up.component";

@Component({
  selector: "forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class ForgotPasswordComponent implements OnInit {
  showPassWordString: boolean = false;
  uniqueCode: string = "";
  user: UserDetails;
  lessOTPDigits: string = "";
  showOtp: boolean = false;
  emailVerified: boolean = false;
  emailMessage: string;
  otpLength: number = 0;
  verifiedMobile: boolean = true;
  value: any;
  forgetPassForm: FormGroup;
  forgetPassDetails = {} as ForgetPassDetails;
  phoneNumberChecked: boolean = false;
  OtpscreenShow: boolean = false;
  phonescreenShow: boolean = true;
  passscreenShow: boolean = false;
  lastFourDigit: any;
  otpValue: number;
  otpMessageVerify: string = "";
  countryList: CountryCode[] = []
  searchCountry: string = '';
  primaryCallingCode: string = '';
  livingCountry: CountryCode[] = [];
  ipaddress: string = '';
  countryCode: string;
  emailSendMessage: boolean = false
  callingCode: string;
  constructor(
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private signInSignupService: SignInSignupService,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private navService: AppNavigationService,
    private commonService: CommonService,
    private visitorsService: VisitorService
  ) { }

  ngOnInit() {
    this.countryCode = localStorage.getItem("countryCode")

    this.callingCode = localStorage.getItem("callingCode")

    this.route.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
      this.formInit();
      if (this.uniqueCode) {
        this.getUserInfo(this.uniqueCode);
      }
      this.getLocation();
    });
    // let urlLength = this.router.url.toString().length;
    // let lastSlash = this.router.url.toString().lastIndexOf("/");
    // this.uniqueCode = this.router.url.toString().slice(lastSlash, urlLength);
  }

  verifyEmail(event) {
    const email = event.target.value
    if (email.match(FieldRegExConst.EMAIL)) {
      this.signInSignupService.verifyEMAIL(this.forgetPassForm.value.email).then(res => {
        if (res) {
          this.emailVerified = !res.data;
          this.emailMessage = res.message;
        }
      });
    }
  }

  getLocation() {
    let emailValidator = [
      Validators.required,
      Validators.pattern(FieldRegExConst.EMAIL)
    ]
    this.getCountryCode(this.countryCode)
    if (this.callingCode === '+91') {
      this.forgetPassForm.get('email').setValidators(emailValidator)
      this.forgetPassForm.get('phone').setValidators(Validators.required)
    }
    else {
      this.forgetPassForm.get('email').setValidators(emailValidator)
    }
  }

  getCountryCode(countryCode) {
    this.commonService.getCountry().then(res => {
      this.countryList = res.data;
      this.livingCountry = this.countryList.filter(val => {
        return val.countryCode.toLowerCase() === countryCode.toLowerCase();
      })
      this.forgetPassForm.get('countryCode').setValue(this.livingCountry[0])
    })
  }

  get selectedCountry() {
    return this.forgetPassForm.get('countryCode').value;
  }


  getUserInfo(code) {
    this._userService.getUserInfoUniqueCode(code).then(res => {
      this.user = res.data;
      this.forgetPassForm.patchValue({ phone: this.user ? this.user.contactNo : '' })
    });
  }

  organisationTypes: OrganisationType[] = [
    { value: "Contractor", viewValue: "Contractor" },
    { value: "Supplier", viewValue: "Supplier" }
  ];

  formInit() {
    this.forgetPassForm = this.formBuilder.group({
      countryCode: [],
      phone: [],
      organisationType: ["Contractor"],
      password: ["", [Validators.required, Validators.minLength(6)]],
      otp: [""],
      email: [''],
    });

    if (this.user && this.user.contactNo && this.user.contactNo.length === 10) {
      this.enterPhone(event, this.user.contactNo)
    }
  }

  forgetPasswordSubmit() {
    this.forgetPassDetails.password = this.forgetPassForm.value.password;
    this.forgetPassDetails.confirmPassword = this.forgetPassForm.value.password;

    this.signInSignupService.forgotPassword(this.forgetPassDetails).then(res => {
      if (res.data.success) {
        this._snackBar.open("Your password has been reset successfully", "", {
          duration: 2000,
          panelClass: ["success-snackbar"],
          verticalPosition: "bottom"
        });
        this.router.navigate(['auth/login']);
        localStorage.clear();
      }
    });
  }

  showPassWord() {
    if (!this.showPassWordString) {
      this.showPassWordString = true;
    } else {
      this.showPassWordString = false;
    }
  }
  enterPhone(event, numberPassed?: string) {
    this.verifiedMobile = true;
    this.showOtp = false;
    this.value = numberPassed ? numberPassed : event.target.value;
    if (this.value.length == 10) {
      this.phoneNumberChecked = true;
      this.verifyMobile(this.value);
    }
    else {
      this.phoneNumberChecked = false;
    }
  }
  sendOtpBtn() {
    if (this.value.length == 10) {
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
  }

  sendotp(value) {
    let countryCode = this.forgetPassForm.get('countryCode').value.callingCode;
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
    let countryCode = this.forgetPassForm.get('countryCode').value.callingCode;
    this.signInSignupService.VerifyMobile(mobile, countryCode).then(res => {
      this.verifiedMobile = res.data;
      if (this.verifiedMobile) {
        this._snackBar.open("User is not registered. Please Sign up", "", {
          duration: 2000,
          panelClass: ["success-snackbar"],
          verticalPosition: "bottom"
        });
      }
    });
  }
  enterOTP(event) {
    const otp = event.target.value;
    this.otpLength = event.target.value.length;
    if (event.target.value.length == 4) {
      this.otpLength = event.target.value.length;
      this.otpValue = event.target.value;
    }
  }
  verifyOTP(otp) {
    let countryCode = this.forgetPassForm.get('countryCode').value.callingCode;
    this.signInSignupService.verifyForgetPasswordOTP(this.forgetPassForm.value.phone, otp, 'fooClientIdPassword', countryCode).then(res => {
      if (res.data) {
        this.lessOTPDigits = res.data.success;
        this.otpMessageVerify = res.data.message;
        localStorage.setItem('SSO_ACCESS_TOKEN', res.data.access_token);
        if (this.lessOTPDigits) {
          this.OtpscreenShow = false;
          this.phonescreenShow = false;
          this.passscreenShow = true;
        }
      }
    });
  }
  submitNumber() {
    if (this.callingCode === '+91' && !this.verifiedMobile) {
      this.OtpscreenShow = true;
      this.phonescreenShow = false;
      this.passscreenShow = false;
      this.forgetPassForm.value.otp = null;
      this.otpMessageVerify = "";
      this.otpLength = 0;
      this.lastFourDigit = this.value.substring(6, 10);
      this.getCountryCode
      this.sendotp(this.value);
    }
    else {
      this.signInSignupService.verifyResetEmail(this.forgetPassForm.get('email').value, 'fooClientIdPassword').then(res => {
        if (res.data.success) {
          this._snackBar.open(`Password change email is sent to ${this.forgetPassForm.get('email').value}`, "", {
            duration: 4000,
            panelClass: ["success-snackbar"],
            verticalPosition: "bottom"
          });

        }
        console.log(res)
      })
    }

  }
  resendOtp() {
    this.sendotp(this.value);
  }
  submitOTP() {
    this.verifyOTP(this.otpValue);
  }
  submitPass() {
    this.forgetPasswordSubmit();
  }
  goBackToNumber() {
    this.OtpscreenShow = false;
    this.phonescreenShow = true;
    this.passscreenShow = false;
  }

  reDirectToSignIn() {
    if (this.uniqueCode) {
      this.router.navigate(['auth/login/' + this.uniqueCode]);
    }
    else {
      this.router.navigate(['auth/login']);
    }
  }

}

