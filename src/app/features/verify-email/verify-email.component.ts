import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SignInSignupService } from 'src/app/shared/services/signupSignin/signupSignin.service';

@Component({
    selector: 'app-verify-email',
    templateUrl: 'verify-email.component.html'
})

export class VerifyEmailComponent implements OnInit {
    constructor(private route: ActivatedRoute, private signInService: SignInSignupService) { }
    token: string;
    verificationStatus: string;
    ngOnInit() {
        this.token = this.route.snapshot.params['token']
        this.signInService.emailVerification(this.token).then(res => {
            this.verificationStatus = res.data;
        })
    }
}
