import {Component, OnInit} from "@angular/core";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {SignInSignupService} from "src/app/shared/services/signupSignin/signupSignin.service";
import {SignInData} from "src/app/shared/models/signIn/signIn-detail-list";
import {Router} from "@angular/router";
import {FieldRegExConst} from "src/app/shared/constants/field-regex-constants";
import {UserService} from "src/app/shared/services/userDashboard/user.service";

@Component({
  selector: "signin",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class SigninComponent implements OnInit {
  showPassWordString: boolean = false;
  constructor(private router: Router, private signInSignupService: SignInSignupService, private formBuilder: FormBuilder, private _userService: UserService) {}
  signinForm: FormGroup;
  signInData = {} as SignInData;
  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.signinForm = this.formBuilder.group({
      phone: ["", [Validators.required, Validators.pattern(FieldRegExConst.PHONE)]],
      password: ["", Validators.required]
    });
  }

  signin() {
    let params = new URLSearchParams();
    params.append("username", this.signinForm.value.phone);
    params.append("password", this.signinForm.value.password);
    params.append("grant_type", "password");
    params.append("client_id", "fooClientIdPassword");
    params.append("userType", "BUYER");

    this.signInSignupService.signIn(params.toString()).then(data => {
      if (data.serviceRawResponse.data) {
        const role = data.serviceRawResponse.data.role;

        if (role) {
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
}
