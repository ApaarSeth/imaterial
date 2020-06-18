import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SignINDetailLists } from "../../../shared/models/signIn/signIn-detail-list";
import { SignInSignupService } from "src/app/shared/services/signupSignin/signupSignin.service";
import { Router, ActivatedRoute } from "@angular/router";
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

export interface OrganisationType {
  value: string;
  viewValue: string;
}

@Component({
  selector: "signup",
  templateUrl: "./signup.component.html"
})

export class SignupComponent implements OnInit {
  showPassWordString: boolean = false;
  uniqueCode: string = "";
  user: UserDetails;
  lessOTPDigits: boolean = false;
  showOtp: boolean = false;
  emailVerified: boolean = true;
  emailMessage: string;
  otpLength: number = 0;
  verifiedMobile: boolean = false;
  value: any;
  organisationDisabled: boolean = false;
  searchCountry: string = '';
  countryList: CountryCode[] = [];
  primaryCallingCode: string = '';
  constructor(
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
    private visitorsService: VisitorService
  ) { }
  acceptTerms: boolean;
  signupForm: FormGroup;
  ipaddress: string;
  signInDetails = {} as SignINDetailLists;
  livingCountry: CountryCode[] = [];
  callingCode: string = '+51';
  ngOnInit() {
    this.primaryCallingCode = localStorage.getItem('callingCode')
    this.route.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];

      if (this.uniqueCode) {
        // this.lessOTPDigits = true;
        this.organisationDisabled = true;
        this.getUserInfo(this.uniqueCode);
      } else {
        this.formInit();
      }
    });
    this.getLocation();
    // this.getCountryCode();
    // let urlLength = this.router.url.toString().length;
    // let lastSlash = this.router.url.toString().lastIndexOf("/");
    // this.uniqueCode = this.router.url.toString().slice(lastSlash, urlLength);
  }


  get selectedCountry() {
    return this.signupForm.get('countryCode').value;
  }


  getLocation() {
    let emailValidator = [
      Validators.required,
      Validators.pattern(FieldRegExConst.EMAIL)
    ]
    this.visitorsService.getIpAddress().subscribe(res => {
      this.ipaddress = res['ip'];
      this.visitorsService.getGEOLocation(this.ipaddress).subscribe(res => {
        // this.callingCode = res['calling_code'];
        this.getCountryCode(res['calling_code'])
        if (this.callingCode === '+91') {
          this.signupForm.get('email').setValidators(emailValidator)
          this.signupForm.get('phone').setValidators(Validators.required)
          this.signupForm.get('otp').setValidators(Validators.required)
        }
        else {
          this.signupForm.get('email').setValidators(emailValidator)

        }
      });
    });
  }

  getCountryCode(callingCode) {
    this.commonService.getCountry().then(res => {
      this.countryList = res.data;
      this.livingCountry = this.countryList.filter(val => {
        return val.callingCode === callingCode;
      })
      this.signupForm.get('countryCode').setValue(this.livingCountry[0])
    })
  }

  getUserInfo(code) {
    this._userService.getUserInfoUniqueCode(code).then(res => {
      this.user = res.data[0];
      if (res.data[0].firstName)
        localStorage.setItem("userName", res.data[0].firstName);
      this.formInit();
    });
  }

  organisationTypes: OrganisationType[] = [
    { value: "Contractor", viewValue: "Contractor" },
    { value: "Supplier", viewValue: "Supplier" }
  ];

  formInit() {
    this.signupForm = this.formBuilder.group({
      countryCode: [{ value: '', disabled: true }],
      email: [this.user ? this.user.email : ''],
      phone: [this.user ? this.user.contactNo : ''],
      organisationName: [{ value: this.user ? this.user.companyName : '', disabled: this.organisationDisabled }, Validators.required],
      organisationType: ["Contractor", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      otp: [""]
    });

    if (this.user && this.user.contactNo && this.user.contactNo.length === 10) {
      this.enterPhone(event, this.user.contactNo)
    }
    console.log(this.signupForm)
  }

  signup() {
    // this.signInDetails.countryCode = this.signupForm.value.countryCode.callingCode;
    this.signInDetails.password = this.signupForm.value.password;
    this.signInDetails.confirmPassword = this.signupForm.value.password;
    this.signInDetails.phone = this.callingCode === '+91' ? this.signupForm.value.phone : null;
    this.signInDetails.email = this.signupForm.value.email;
    this.signInDetails.countryCode = this.callingCode === '+91' ? '+91' : '+1',
      this.signInDetails.loginIdType = this.callingCode === '+91' ? 'PHONE' : 'EMAIL',
      this.signInDetails.clientId = "fooClientIdPassword";
    if (this.uniqueCode) {
      this.signInDetails.firstName = this.user.firstName ? this.user.firstName : null;
      this.signInDetails.lastName = this.user.lastName ? this.user.lastName : null;
    }
    this.signInDetails.customData = {
      uniqueCode: this.uniqueCode !== "" ? this.uniqueCode : null,
      countryCode: this.callingCode === '+91' ? '+91' : null,
      countryId: null,
      organizationName: this.signupForm.value.organisationName,
      organizationType: this.signupForm.value.organisationType,
      organizationId: this.user ? this.user.organizationId.toString() : null,
      userId: this.user ? this.user.userId.toString() : null,

      // organizationId: this.user ? this.user.organizationId : 0,
      // userId: this.user ? this.user.userId : 0
    };

    this.signInSignupService.signUp(this.signInDetails).then(data => {
      if (data.status === 1002) {
        this._snackBar.open("Phone Number already used", "", {
          duration: 2000,
          panelClass: ["warning-snackbar"],
          verticalPosition: "bottom"
        });
      }
      else if (data.data.serviceRawResponse.data as auth) {
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

  showPassWord() {
    if (!this.showPassWordString) {
      this.showPassWordString = true;
    } else {
      this.showPassWordString = false;
    }
  }

  enterPhone(event, numberPassed?: string) {
    this.lessOTPDigits = false;

    this.verifiedMobile = false;
    this.showOtp = false;
    this.value = numberPassed ? numberPassed : event.target.value;
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

  verifyEmail(event) {
    const email = event.target.value
    if (email.match(FieldRegExConst.EMAIL)) {
      this.signInSignupService.verifyEMAIL(this.signupForm.value.email).then(res => {
        if (res) {
          this.emailVerified = res.data;
          this.emailMessage = res.message;
        }
      });
    }
  }




}
