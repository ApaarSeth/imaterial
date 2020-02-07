import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { SignInSignupService } from "src/app/shared/services/signupSignin/signupSignin.service";
import { SignInData } from "src/app/shared/models/signIn/signIn-detail-list";
import { Router } from "@angular/router";

@Component({
  selector: "signin",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class SigninComponent implements OnInit {
  constructor(
    private router: Router,
    private signInSignupService: SignInSignupService,
    private formBuilder: FormBuilder
  ) {}
  signinForm: FormGroup;
  signInData = {} as SignInData;
  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.signinForm = this.formBuilder.group({
      userName: ["", Validators.required],
      password: ["", Validators.required]
    });
    console.log("details", this.signinForm.value);
  }

  signin() {
    let params = new URLSearchParams();
    params.append("username", this.signinForm.value.userName);
    params.append("password", this.signinForm.value.password);
    params.append("grant_type", "password");
    params.append("client_id", "fooClientIdPassword");
    params.append("userType", "BUYER");

    this.signInSignupService.signIn(params.toString()).then(data => {
      console.log(data);
      localStorage.setItem("role", data.serviceRawResponse.data.role);
      localStorage.setItem(
        "ServiceToken",
        data.serviceRawResponse.data.serviceToken
      );
      localStorage.setItem("userId", data.serviceRawResponse.data.userId);
      localStorage.setItem("orgId", data.serviceRawResponse.data.orgId);
      this.router.navigate(["dashboad"]);
    });
  }
}
