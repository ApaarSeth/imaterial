import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SignINDetailLists } from "../../../shared/models/signIn/signIn-detail-list";
import { from } from "rxjs";
import { SignInSignupService } from "src/app/shared/services/signupSignin/signupSignin.service";
import { Router } from "@angular/router";

export interface OrganisationType {
  value: string;
  viewValue: string;
}

@Component({
  selector: "signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class SignupComponent implements OnInit {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private signInSignupService: SignInSignupService
  ) {}
  signupForm: FormGroup;
  signInDetails = {} as SignINDetailLists;
  ngOnInit() {
    this.formInit();
  }

  organisationTypes: OrganisationType[] = [
    { value: "Contractor", viewValue: "Contractor" },
    { value: "Supplier", viewValue: "Supplier" }
  ];

  formInit() {
    this.signupForm = this.formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", Validators.required],
      phone: ["", Validators.required],
      organisationName: ["", Validators.required],
      organisationType: ["", Validators.required],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required]
    });
    console.log("details", this.signupForm.value);
  }
  signup() {
    // this.signInDetails =  this.signupForm.value;
    this.signInDetails.firstName = this.signupForm.value.firstName;
    this.signInDetails.lastName = this.signupForm.value.lastName;
    this.signInDetails.password = this.signupForm.value.password;
    this.signInDetails.confirmPassword = this.signupForm.value.confirmPassword;
    this.signInDetails.phone = this.signupForm.value.phone;
    this.signInDetails.email = this.signupForm.value.email;
    this.signInDetails.clientId = "fooClientIdPassword";
    this.signInDetails.customData = {
      organizationName: this.signupForm.value.organisationName,
      organizationType: this.signupForm.value.organisationType
    };
    this.signInSignupService.signUp(this.signInDetails).then(data => {
      console.log(data.data.serviceRawResponse.data);
      localStorage.setItem("Role", data.data.serviceRawResponse.data.Role);
      localStorage.setItem(
        "ServiceToken",
        data.data.serviceRawResponse.data.serviceToken
      );
      localStorage.setItem("userId", data.data.serviceRawResponse.data.userId);
      localStorage.setItem("orgId", data.data.serviceRawResponse.data.orgId);
      this.router.navigate(["dashboard"]);
    });
    // console.log("filled values", this.signInDetails);
  }
}
