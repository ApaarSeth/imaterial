import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignInSignupService } from 'src/app/shared/services/signupSignin/signupSignin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: "reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class ResetPasswordComponent implements OnInit {
  forgetPassForm: FormGroup;
  showPassWordString: boolean = false;
  showRetypePassWordString: boolean = false;
  token: string;
  accessToken: string;
  constructor(private snackbar: MatSnackBar, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private signInSignupService: SignInSignupService) { }
  passwordMatch = false;
  ngOnInit() {
    this.formInit();
    this.route.params.subscribe(param => {
      this.token = param['token']
      this.verifyResetPassword()
    })

  }

  verifyResetPassword() {
    this.signInSignupService.verifyResetPassword(this.token, 'fooClientIdPassword').then(res => {
      this.accessToken = res.data['access_token'];
      localStorage.setItem('SSO_ACCESS_TOKEN', this.accessToken)
    })
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
    let data = {
      confirmPassword: this.forgetPassForm.get('password').value,
      password: this.forgetPassForm.get('password').value
    }
    this.signInSignupService.emailResetPassword(data).then(res => {
      if (res.data && res.data.success) {
        this.snackbar.open("Password Changed Successfully", "", {
          duration: 2000,
          panelClass: ["warning-snackbar"],
          verticalPosition: "bottom"
        });
        this.router.navigate(['auth/login'])
      }
    })
  }
}
