import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SignInSignUpComponent } from "./sign-in-sign-up/sign-in-sign-up.component";

const routes: Routes = [
  {
    path: "login",
    component: SignInSignUpComponent,
  },
  {
    path: "login/:uniqueCode",
    component: SignInSignUpComponent
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent
  },
  {
    path: "forgot-password/:uniqueCode",
    component: ForgotPasswordComponent
  },
  {
    path: "reset-password/:token",
    component: ResetPasswordComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class AuthRoutingModule { }
