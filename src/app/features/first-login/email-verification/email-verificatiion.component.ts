import { Component, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from '../../../shared/services/token.service';
import { SignInSignupService } from '../../../shared/services/signupSignin.service';

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