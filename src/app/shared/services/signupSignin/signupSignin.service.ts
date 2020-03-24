import { Observable } from "rxjs";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
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
        if (e.error.error === 'invalid_grant' || e.error.error === 'unauthorized') {
          let data: any = {};
          data.erroType = 'Invalid Credentials',
            data.errorMessage = 'Phone No. or Password Incorrect';
          console.log(e.error_description);
          return data;
        }
        // console.error(e);
      });
  }
  sendOTP(phone) {
    return this.dataService.sendPostRequestSsoEncodedUrl(API.SENDOTP(phone), {}).then(res => { return res });
  }
  verifyOTP(phone, otp) {
    return this.dataService.sendPostRequestSsoEncodedUrl(API.VERIFYOTP(phone, otp), {}).then(res => { return res });
  }
  verifyEMAIL(email) {
    return this.dataService.getRequest(API.VERIFYEMAIL(email)).then(res => { return res });
  }
  VerifyMobile(mobile){
    return this.dataService.getRequest(API.VERIFYMOBILE(mobile)).then(res => { return res });
  }
}