import { Observable } from "rxjs";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: "root"
  })
export class SignInSignupService implements OnInit{
    ngOnInit(): void {
    }
    constructor(private dataService: DataService) {}

    signUp(data) {
        return this.dataService.sendPostRequestSso(API.SIGNUP,data).catch(e=>{
            console.error(e);
        });
      }

      signIn(data) {
        return this.dataService.sendPostRequestSsoEncodedUrl(API.SIGNIN,data)
        .then(res => {
          localStorage.setItem("role", res.serviceRawResponse.data.role);
          localStorage.setItem("ServiceToken",res.serviceRawResponse.data.serviceToken);
          localStorage.setItem("userId", res.serviceRawResponse.data.userId);
          localStorage.setItem("orgId", res.serviceRawResponse.data.orgId);
          if(res.serviceRawResponse.data.success === 'true'){
            return res;
          }
        })
        .catch(e=>{
            console.error(e);
        });
      }
}