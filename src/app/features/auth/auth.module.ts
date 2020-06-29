import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { SignupComponent } from "./signup/signup.component";
import { SigninComponent } from "./sign-in/sign-in.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { OTPComponent } from "./otp/otp.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { SignInSignUpComponent } from './sign-in-sign-up/sign-in-sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { InitialCountryResolver } from './sign-in-sign-up/resolver/initial-country.resolver';

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
  providers: [InitialCountryResolver],
  declarations: [
    SignupComponent,
    SigninComponent,
    OTPComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SignInSignUpComponent
  ]
})
export class AuthModule { }
