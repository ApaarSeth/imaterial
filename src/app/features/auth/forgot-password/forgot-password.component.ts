import { Component, OnInit } from "@angular/core";
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { TokenService } from 'src/app/shared/services/token.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SignInSignupService } from 'src/app/shared/services/signupSignin/signupSignin.service';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { MatSnackBar } from '@angular/material';
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { OrganisationType } from '../signup/signup.component';
import { auth } from 'src/app/shared/models/auth';
import { UserDetails } from 'src/app/shared/models/user-details';
import { SignINDetailLists, ForgetPassDetails } from 'src/app/shared/models/signIn/signIn-detail-list';

@Component({
  selector: "forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class ForgotPasswordComponent implements OnInit {
  showPassWordString: boolean = false;
  uniqueCode: string = "";
  user: UserDetails;
  lessOTPDigits: boolean = false;
  showOtp: boolean = false;
  emailVerified: boolean = true;
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

  constructor(
       private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private signInSignupService: SignInSignupService,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private navService: AppNavigationService
  ) {}

   ngOnInit() {
    this.route.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
      if (this.uniqueCode) {
        this.getUserInfo(this.uniqueCode);
      } else {
        this.formInit();
      }
    });
    // let urlLength = this.router.url.toString().length;
    // let lastSlash = this.router.url.toString().lastIndexOf("/");
    // this.uniqueCode = this.router.url.toString().slice(lastSlash, urlLength);
  }

  getUserInfo(code) {
    this._userService.getUserInfoUniqueCode(code).then(res => {
      this.user = res.data[0];
      this.formInit();
    });
  }

  organisationTypes: OrganisationType[] = [
    { value: "Contractor", viewValue: "Contractor" },
    { value: "Supplier", viewValue: "Supplier" }
  ];

  formInit() {
    this.forgetPassForm = this.formBuilder.group({
      phone: [this.user ? this.user.contactNo : '', [Validators.required, Validators.pattern(FieldRegExConst.PHONE)]],
      organisationType: ["Contractor", Validators.required],
      password: ["", Validators.required],
      otp: ["", [Validators.required]]
    });

    if (this.user && this.user.contactNo && this.user.contactNo.length === 10) {
      this.enterPhone(event, this.user.contactNo)
    }
  }

  forgetPasswordSubmit() {
    this.forgetPassDetails.password = this.forgetPassForm.value.password;
    this.forgetPassDetails.confirmPassword = this.forgetPassForm.value.password;
    this.forgetPassDetails.phone = this.forgetPassForm.value.phone;
    this.forgetPassDetails.clientId = "fooClientIdPassword";
   
    this.forgetPassDetails.customData = {
      uniqueCode: this.uniqueCode !== "" ? this.uniqueCode : null,
      organizationName: this.forgetPassForm.value.organisationName,
      organizationType: this.forgetPassForm.value.organisationType,
      organizationId: this.user ? this.user.organizationId.toString() : null,
      userId: this.user ? this.user.userId.toString() : null,

      // organizationId: this.user ? this.user.organizationId : 0,
      // userId: this.user ? this.user.userId : 0
    };

    this.signInSignupService.signUp(this.forgetPassDetails).then(data => {
      if (data.status === 1002) {
        this._snackBar.open("Phone Number already used", "", {
          duration: 2000,
          panelClass: ["warning-snackbar"],
          verticalPosition: "top"
        });
      }
      else if (data.data.serviceRawResponse.data as auth) {
        this.tokenService.setAuthResponseData(data.data.serviceRawResponse.data)
        this.navService.gaEvent({
          action: 'submit',
          category: 'Signup_successfully',
          label: 'email-id',
          value: null
        });
        // localStorage.setItem("role", data.data.serviceRawResponse.data.role);
        // localStorage.setItem("accessToken", data.data.serviceRawResponse.data.serviceToken);
        // localStorage.setItem("userId", data.data.serviceRawResponse.data.userId);
        // localStorage.setItem("orgId", data.data.serviceRawResponse.data.orgId);

        // if (data.data.serviceRawResponse.data.role || this.uniqueCode !== "") {
        if (this.uniqueCode) {
          this.router.navigate(["/dashboard"]);
        } else {
          // this.router.navigate(["/profile/update-info"]);
          this.router.navigate(["/profile/terms-conditions"]);
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
    this.verifiedMobile = true;
    this.showOtp = false;
    this.value = numberPassed ? numberPassed : event.target.value;
     if ((this.value.match(FieldRegExConst.PHONE)) && (this.value.length == 10)) {
       this.phoneNumberChecked = true;
       this.verifyMobile(this.value);
     }
     else{
         this.phoneNumberChecked = false;
     }
  }
  sendOtpBtn(){
      if ((this.value.match(FieldRegExConst.PHONE)) && (this.value.length == 10)) {
       if (!this.uniqueCode) {
          this.verifyMobile(this.value);
       }
       if((this.uniqueCode) && (this.user.contactNo == this.value)){
          this.sendotp(this.value);
        }
        else if((this.uniqueCode) && (this.user.contactNo != this.value)){
           this.verifyMobile(this.value);
        }
    }
  }

  sendotp(value){
     this.signInSignupService.sendOTP(value).then(res => {
              if (res.data)
                this.showOtp = res.data.success;
              this._snackBar.open("OTP has been sent on your phone number", "", {
                duration: 2000,
                panelClass: ["success-snackbar"],
                verticalPosition: "top"
              });

            });
  }

  verifyMobile(mobile){
     this.signInSignupService.VerifyMobile(mobile).then(res => {
            this.verifiedMobile = res.data;
            this._snackBar.open(res.message, "", {
                duration: 2000,
                panelClass: ["success-snackbar"],
                verticalPosition: "top"
              });
     });
  }
  enterOTP(event) {
    const otp = event.target.value;
    this.showOtp = false;
    this.otpLength = event.target.value.length;
    if (event.target.value.length == 4) {
      this.otpLength = event.target.value.length;
      this.signInSignupService.verifyOTP(this.forgetPassForm.value.phone, otp).then(res => {
        if (res.data) {
          this.lessOTPDigits = res.data.success;
        }
      });
    }
  }
submitNumber(){
    if(!this.verifiedMobile){
      this.OtpscreenShow = true;
      this.phonescreenShow = false;
      this.passscreenShow = false;
      this.lastFourDigit = this.value.substring(6,10);
      this.sendotp(this.value);
    }
  
}
resendOtp(){
   this.sendotp(this.value);
}
submitOTP(){
  this.OtpscreenShow = false;
  this.phonescreenShow = false;
  this.passscreenShow = true;
}
submitPass(){
this.forgetPasswordSubmit();
}
goBackToNumber(){
    
      this.OtpscreenShow = false;
      this.phonescreenShow = true;
      this.passscreenShow = false;  
}

}

