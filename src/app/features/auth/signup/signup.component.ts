import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {SignINDetailLists} from "../../../shared/models/signIn/signIn-detail-list";
import {SignInSignupService} from "src/app/shared/services/signupSignin/signupSignin.service";
import {Router, ActivatedRoute} from "@angular/router";
import {FieldRegExConst} from "src/app/shared/constants/field-regex-constants";
import {UserService} from "src/app/shared/services/userDashboard/user.service";
import { UserDetails } from 'src/app/shared/models/user-details';

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
    this.route.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
      if(this.uniqueCode){
        this.getUserInfo(this.uniqueCode);
      }else{
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
    {value: "Contractor", viewValue: "Contractor"},
    {value: "Supplier", viewValue: "Supplier"}
  ];

  formInit() {
    this.signupForm = this.formBuilder.group({
      email: [this.user ? this.user.email : '', [Validators.required, Validators.pattern(FieldRegExConst.EMAIL)]],
      phone: [this.user ? this.user.contactNo : '', [Validators.required, Validators.pattern(FieldRegExConst.PHONE)]],
      organisationName: [this.user ? this.user.companyName : '', Validators.required],
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
      organizationType: this.signupForm.value.organisationType,
      organizationId: this.user ? this.user.organizationId : 0,
      userId: this.user ? this.user.userId : 0
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
