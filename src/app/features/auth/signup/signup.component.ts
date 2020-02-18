import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SignINDetailLists } from "../../../shared/models/signIn/signIn-detail-list";
import { from } from "rxjs";
import { SignInSignupService } from "src/app/shared/services/signupSignin/signupSignin.service";
import { Router } from "@angular/router";
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';

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
      // firstName: ["", Validators.required],
      // lastName: ["", Validators.required],
      email: ["", [Validators.required,Validators.pattern(FieldRegExConst.EMAIL)]],
      phone: ["", [Validators.required,Validators.pattern(FieldRegExConst.PHONE)]],
      organisationName: ["", Validators.required],
      organisationType: ["Contractor", Validators.required],
      password: ["", Validators.required]
      // confirmPassword: ["", Validators.required]
    });
  }
  signup() {
    // this.signInDetails =  this.signupForm.valupe;
    // this.signInDetails.firstName = this.signupForm.value.firstName
    // this.signInDetails.lastName = this.signupForm.value.lastName
    this.signInDetails.password = this.signupForm.value.password
    this.signInDetails.confirmPassword = this.signupForm.value.password
    this.signInDetails.phone = this.signupForm.value.phone
    this.signInDetails.email = this.signupForm.value.email
    this.signInDetails.clientId=  "fooClientIdPassword"
    this.signInDetails.customData = {organizationName :this.signupForm.value.organisationName,
   organizationType :this.signupForm.value.organisationType}
   this.signInSignupService.signUp(this.signInDetails).then(data => {
     console.log(data.data.serviceRawResponse.data)
    if (data.data.serviceRawResponse.data){
      localStorage.setItem('role', data.data.serviceRawResponse.data.role);
       localStorage.setItem('ServiceToken', data.data.serviceRawResponse.data.serviceToken);
       localStorage.setItem('userId', data.data.serviceRawResponse.data.userId);
       localStorage.setItem('orgId', data.data.serviceRawResponse.data.orgId);
      this.router.navigate(["dashboard"]);
    }
  });
// console.log("filled values", this.signInDetails);



   }
    showPassWord(){
    if(!this.showPassWordString){
      this.showPassWordString = true;
    }else{
       this.showPassWordString = false;
    }
  }
}
