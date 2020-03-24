import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./sign-in/sign-in.component";
import { OTPComponent } from "./otp/otp.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { SignInSignUpComponent } from "./sign-in-sign-up/sign-in-sign-up.component";

const routes: Routes = [
  {
    path: "login",
    component: SignInSignUpComponent
  },
  {
    path: "login/:uniqueCode",
    component: SignInSignUpComponent
  },
  // {
  //   path: "signup",
  //   component: SignupComponent
  // },
  // {
  //   path: "signin",
  //   component: SigninComponent
  // },
  {
    path: "otp",
    component: OTPComponent
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },
  {
    path: "change-password",
    component: ChangePasswordComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class AuthRoutingModule { }
