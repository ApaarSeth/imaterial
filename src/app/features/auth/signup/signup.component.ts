import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {SignINDetailLists} from "../../../shared/models/signIn/signIn-detail-list";
import {from} from "rxjs";
import {SignInSignupService} from "src/app/shared/services/signupSignin/signupSignin.service";
import {Router, ActivatedRoute} from "@angular/router";
import {FieldRegExConst} from "src/app/shared/constants/field-regex-constants";
import {UserService} from "src/app/shared/services/userDashboard/user.service";

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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private signInSignupService: SignInSignupService,
    private _userService: UserService
  ) {}
  signupForm: FormGroup;
  signInDetails = {} as SignINDetailLists;
  ngOnInit() {
    this.formInit();
    this.route.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
    });
    // let urlLength = this.router.url.toString().length;
    // let lastSlash = this.router.url.toString().lastIndexOf("/");
    // this.uniqueCode = this.router.url.toString().slice(lastSlash, urlLength);
  }

  organisationTypes: OrganisationType[] = [
    {value: "Contractor", viewValue: "Contractor"},
    {value: "Supplier", viewValue: "Supplier"}
  ];

  formInit() {
    this.signupForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.pattern(FieldRegExConst.EMAIL)]],
      phone: ["", [Validators.required, Validators.pattern(FieldRegExConst.PHONE)]],
      organisationName: ["", Validators.required],
      organisationType: ["Contractor", Validators.required],
      password: ["", Validators.required]
    });
  }

  signup() {
    this.signInDetails.password = this.signupForm.value.password;
    this.signInDetails.confirmPassword = this.signupForm.value.password;
    this.signInDetails.phone = this.signupForm.value.phone;
    this.signInDetails.email = this.signupForm.value.email;
    this.signInDetails.clientId = "fooClientIdPassword";
    this.signInDetails.customData = {
      uniqueCode: this.uniqueCode !== "" ? this.uniqueCode : null,
      organizationName: this.signupForm.value.organisationName,
      organizationType: this.signupForm.value.organisationType
    };

    this.signInSignupService.signUp(this.signInDetails).then(data => {
      if (data.data.serviceRawResponse.data) {
        localStorage.setItem("role", data.data.serviceRawResponse.data.role);
        localStorage.setItem("ServiceToken", data.data.serviceRawResponse.data.serviceToken);
        localStorage.setItem("userId", data.data.serviceRawResponse.data.userId);
        localStorage.setItem("orgId", data.data.serviceRawResponse.data.orgId);

        // if (data.data.serviceRawResponse.data.role || this.uniqueCode !== "") {
          if (this.uniqueCode) {
          this.router.navigate(["/dashboard"]);
        } else {
          this.router.navigate(["/users/organisation/update-info"]);
        }

        // this.getUserInformation(userId);
        // this.router.navigate(["/dashboard"]);
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

  // getUserInformation(userId){
  //   this._userService.getUserInfo(userId).then(res => {
  //     console.log(res);
  //     if(res.data[0].roleId){
  //       this.router.navigate(["/dashboard"]);
  //     }else{
  //       this.router.navigate(["/users/organisation/update-info"]);
  //     }
  //   })
  // }
}
