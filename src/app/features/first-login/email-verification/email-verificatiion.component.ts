import { Component, OnInit } from '@angular/core';
import { SignInSignupService } from 'src/app/shared/services/signupSignin/signupSignin.service';
import { Subscription, interval } from 'rxjs';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-email-verification',
    templateUrl: 'email-verification.component.html'
})

export class EmailVerificationComponent implements OnInit {
    constructor(private router: Router, private signInSignUpService: SignInSignupService) { }
    email: string = "";
    subscription: Subscription;
    checkAccountStatus: number = 0;
    ngOnInit() {
        this.email = localStorage.getItem('email')
        this.resendEmail();
        const source = interval(10000);
        this.subscription = source.subscribe(val => { this.emailVerificationStatus() });

    }

    resendEmail() {
        this.signInSignUpService.resendEmail().then(data => {
            // localStorage.setItem('accountStatus', data);
        })
    }
    emailVerificationStatus() {
        if (!this.checkAccountStatus) {
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