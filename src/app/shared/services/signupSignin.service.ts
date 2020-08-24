import { Observable } from "rxjs";
import { DataService } from "./data.service";
import { API } from "../constants/configuration-constants";
import { Injectable, OnInit } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SignInSignupService implements OnInit {
  ngOnInit(): void {
  }
  constructor(private dataService: DataService) { }

  signUp(data) {
    return this.dataService.sendPostRequestSso(API.SIGNUP, data)
  }

  forgotPassword(data) {
    return this.dataService.resetPasswordSSOPOST(API.FORGOTPASSWORD, data);
  }

  signIn(data) {
    return this.dataService.sendPostRequestSsoEncodedUrl(API.SIGNIN, data)
      .then(res => {
        localStorage.setItem("role", res.serviceRawResponse.data.role);
        localStorage.setItem("ServiceToken", res.serviceRawResponse.data.serviceToken);
        localStorage.setItem("userId", res.serviceRawResponse.data.userId);
        localStorage.setItem("orgId", res.serviceRawResponse.data.orgId);
        if (res.serviceRawResponse.data.success === 'true') {
          return res;
        }
      })
      .catch(e => {
        if (e.error === 'invalid_grant' || e.error === 'unauthorized') {
          let data: any = {};
          data.erroType = 'Invalid Credentials';
          if (localStorage.getItem('countryCode') === 'IN') {
            data.errorMessage = 'Phone No. or Password Incorrect';
          }
          else {
            data.errorMessage = 'Email or Password Incorrect';
          }
          return data;
        }
      });
  }
  sendOTP(phone, callingCode) {
    return this.dataService.sendPostRequestSsoEncodedUrl(API.SENDOTP(phone, callingCode), {}).then(res => { return res });
  }
  verifyOTP(phone, countryCode, otp) {
    return this.dataService.sendPostRequestSsoEncodedUrl(API.VERIFYOTP(phone, countryCode, otp), {}).then(res => { return res });
  }
  verifyResetEmail(email, clientId) {
    let data = { emailId: email, client_id: clientId }
    return this.dataService.sendPostRequestSsoEncodedUrl(API.VERIFYRESETEMAIL(email, clientId), {})
    // return this.dataService.sendPostRequestSso(API.VERIFYRESETEMAIL, data)

  }

  emailResetPassword(data) {
    return this.dataService.resetPasswordSSOPOST(API.EMAILRESETPASSWORD, data)
  }
  verifyForgetPasswordOTP(phone, otp, clientId, countryCode) {
    return this.dataService.sendPostRequestSsoEncodedUrl(API.VERIFYFORGETPASSWORDOTP(phone, otp, clientId, countryCode), {}).then(res => { return res });
  }

  verifyResetPassword(token, clientId) {
    return this.dataService.sendPostRequestSsoEncodedUrl(API.VERIFYRESETPASSWORD(token, clientId), {})
  }

  verifyEMAIL(email) {
    return this.dataService.getRequest(API.VERIFYEMAIL(email), null, { skipLoader: true }).then(res => { return res });
  }
  VerifyMobile(mobile, countryCode) {
    return this.dataService.getRequest(API.VERIFYMOBILE(mobile, countryCode)).then(res => { return res });
  }
  checkTerms() { return this.dataService.getRequest(API.CHECKTERMS) }

  resendEmail() {
    return this.dataService.getRequest(API.RESENDEMAIL)
  }

  emailVerificationStatus() {
    return this.dataService.getRequest(API.EMAILVERFICATIONSTATUS, null, { skipLoader: true })
  }

  emailVerification(token) {
    return this.dataService.getRequest(API.EMAILVERFICATION(token))
  }


}