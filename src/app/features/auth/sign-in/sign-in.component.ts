import { Component, OnInit } from "@angular/core";
<<<<<<< HEAD
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { SignInSignupService } from "src/app/shared/services/signupSignin/signupSignin.service";
import { SignInData } from "src/app/shared/models/signIn/signIn-detail-list";
import { Router } from "@angular/router";
=======
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignInSignupService } from 'src/app/shared/services/signupSignin/signupSignin.service';
import { SignInData } from 'src/app/shared/models/signIn/signIn-detail-list';
import { Router } from '@angular/router';
>>>>>>> d8849fa3f6b856871dd974941f37d01054043c7f

@Component({
  selector: "signin",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class SigninComponent implements OnInit {
  constructor(
<<<<<<< HEAD
    private router: Router,
    private signInSignupService: SignInSignupService,
    private formBuilder: FormBuilder
=======
    private router:Router,
    private signInSignupService :SignInSignupService,
    private formBuilder: FormBuilder,
>>>>>>> d8849fa3f6b856871dd974941f37d01054043c7f
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

<<<<<<< HEAD
  signin() {
    let params = new URLSearchParams();
    params.append("username", this.signinForm.value.userName);
    params.append("password", this.signinForm.value.password);
    params.append("grant_type", "password");
    params.append("client_id", "fooClientIdPassword");
    params.append("userType", "BUYER");
=======
     this.signInSignupService.signIn(params.toString()).then(data => {
      console.log(data)
      localStorage.setItem('role', data.serviceRawResponse.data.role);
     localStorage.setItem('ServiceToken', data.serviceRawResponse.data.serviceToken);
     localStorage.setItem('userId', data.serviceRawResponse.data.userId);
     localStorage.setItem('orgId', data.serviceRawResponse.data.orgId);
     this.router.navigate(["dashboard"]);
   });
>>>>>>> d8849fa3f6b856871dd974941f37d01054043c7f

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
