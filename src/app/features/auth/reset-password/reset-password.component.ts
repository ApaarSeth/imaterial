import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignInSignupService } from 'src/app/shared/services/signupSignin/signupSignin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class ResetPasswordComponent implements OnInit {
  forgetPassForm: FormGroup;
  showPassWordString: boolean = false;
  showRetypePassWordString: boolean = false;
  token: string
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private signInSignupService: SignInSignupService) { }
  passwordMatch = false;
  ngOnInit() {
    this.formInit();
    this.route.params.subscribe(param => {
      this.token = param['token']
      this.verifyResetPassword()
    })

  }

  verifyResetPassword() {
    this.signInSignupService.verifyResetPassword(this.token, 'fooClientIdPassword')
  }

  formInit() {
    this.forgetPassForm = this.formBuilder.group({
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  showPassWord() {
    if (!this.showPassWordString) {
      this.showPassWordString = true;
    } else {
      this.showPassWordString = false;
    }
  }
  showRetypePassWord() {
    if (!this.showRetypePassWordString) {
      this.showRetypePassWordString = true;
    } else {
      this.showRetypePassWordString = false;
    }
  }

  verifyPassword(event) {
    let pass = event.target.value
    if (pass === this.forgetPassForm.get('password').value) {
      this.passwordMatch = true
    }
    else {
      this.passwordMatch = false
    }
  }


  submitPassword() {

  }
}
