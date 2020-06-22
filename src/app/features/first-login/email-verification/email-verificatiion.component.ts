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

    ngOnInit() {
        this.email = "apaarseth@gmail.com"
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
        if (Number(localStorage.getItem('accountStatus'))) {
            this.signInSignUpService.emailVerificationStatus().then(data => {
                localStorage.setItem('accountStatus', data);
                this.router.navigate(["/profile/terms-conditions"])
            })
        }
    }
}