import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./sign-in/sign-in.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { SignInSignUpComponent } from './sign-in-sign-up/sign-in-sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LayoutModule } from "@angular/cdk/layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../shared/material-modules";
import { AppSharedModule } from "../../shared/app-shared-module";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    AppSharedModule,
    AuthRoutingModule,
  ],
  declarations: [
    SignupComponent,
    SigninComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SignInSignUpComponent
  ]
})
export class AuthModule { }
