import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { SignInSignupService } from "src/app/shared/services/signupSignin/signupSignin.service";
import { SignInData } from "src/app/shared/models/signIn/signIn-detail-list";
import { Router, ActivatedRoute } from "@angular/router";
import { FieldRegExConst } from "src/app/shared/constants/field-regex-constants";
import { UserService } from "src/app/shared/services/userDashboard/user.service";
import { MatSnackBar } from '@angular/material';
import { TokenService } from 'src/app/shared/services/token.service';

@Component({
  selector: "signin",
  templateUrl: "./sign-in.component.html"
})

export class SigninComponent implements OnInit {
  uniqueCode: string = "";

  constructor(private tokenService: TokenService, private router: Router,
    private signInSignupService: SignInSignupService,
    private formBuilder: FormBuilder,
    private _userService: UserService,
      private route: ActivatedRoute,
    private _snackBar: MatSnackBar) { }

  showPassWordString: boolean = false;
  signinForm: FormGroup;
  signInData = {} as SignInData;
  ngOnInit() {
     this.route.params.subscribe(param => {
      this.uniqueCode = param["uniqueCode"];
    });


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
      if (data.errorMessage) {
        this._snackBar.open(data.errorMessage, "", {
          duration: 2000,
          panelClass: ["warning-snackbar"],
          verticalPosition: "top"
        });
      }
      else if (data.serviceRawResponse.data) {
        this.tokenService.setAuthResponseData(data.serviceRawResponse.data)
        this.getUserInfo(data.serviceRawResponse.data.userId);
        // const role = data.serviceRawResponse.data.role;

        // if (role) {
        //   this.router.navigate(["/dashboard"]);
        // } else {
        //   this.router.navigate(["/users/organisation/update-info"]);
        // }
      }
    });
  }

  /**
   * 
   * @param userId Logged in user Id
   * @description Function will get the data of logged in user
   */
  getUserInfo(userId) {
    this._userService.getUserInfo(userId).then(res => {
      if(res.data[0].firstName)
        localStorage.setItem("userName",res.data[0].firstName);

      if (res && (res.data[0].firstName === null || res.data[0].firstName === "") && (res.data[0].lastName === null || res.data[0].lastName === "")) {
        this.router.navigate(["/profile/terms-conditions"]);
        // this.router.navigate(['/profile/update-info']);
      }
      else {
        this.router.navigate(['/dashboard']);
      }
    })
  }

  showPassWord() {
    if (!this.showPassWordString) {
      this.showPassWordString = true;
    } else {
      this.showPassWordString = false;
    }
  }
  goToForgetPass(){
    if(this.uniqueCode){
       this.router.navigate(['auth/forgot-password/'+this.uniqueCode]);
    }
    else{
       this.router.navigate(['auth/forgot-password']);
    }
   
  }
}