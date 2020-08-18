import { Component, OnInit } from '@angular/core';
import { SignInSignupService } from 'src/app/shared/services/signupSignin/signupSignin.service';
import { Subscription, interval } from 'rxjs';
import { RouterLink, Router } from '@angular/router';
import { TokenService } from 'src/app/shared/services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-email-verification',
    templateUrl: 'email-verification.component.html'
})

export class EmailVerificationComponent implements OnInit {
    constructor(private tokenService: TokenService, private snackbar: MatSnackBar, private router: Router, private signInSignUpService: SignInSignupService) { }
    email: string = "";
    subscription: Subscription;
    checkAccountStatus: number = 0;
    ngOnInit() {
        this.email = localStorage.getItem('email')
        const source = interval(10000);
        if (this.tokenService.getToken()) {
            this.subscription = source.subscribe(val => { this.emailVerificationStatus() });
        }
    }

    resendEmail() {
        this.signInSignUpService.resendEmail().then(data => {
            this.snackbar.open("Account Verification Email Sent", "", {
                duration: 2000,
                panelClass: ["warning-snackbar"],
                verticalPosition: "bottom"
            });
        })
    }
    emailVerificationStatus() {
        if (!this.checkAccountStatus && localStorage.getItem('email')) {
            this.signInSignUpService.emailVerificationStatus().then(data => {
                this.checkAccountStatus = Number(data);
                if (this.checkAccountStatus) {
                    localStorage.setItem('accountStatus', data);
                    this.router.navigate(["/profile/terms-conditions"])
                }
            })
        }
    }
}