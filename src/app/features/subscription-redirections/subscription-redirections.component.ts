import { AppNavigationService } from './../../shared/services/navigation.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/commonService';
import { SubscriptionPaymentsService } from './../../shared/services/subscriptions-payments.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'subscription-redirections',
    templateUrl: './subscription-redirections.component.html'
})

export class SubscriptionRedirectionsComponent implements OnInit {

    isMobile: boolean;
    pageType: number;
    planName: any;
    userCount: any;
    amount: any;
    currencyCode: any;
    email: string;
    phoneNo: string;


    constructor(
        private commonService: CommonService,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private _userService: UserService,
        private subsPayService: SubscriptionPaymentsService,
        private navService: AppNavigationService
    ) { }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
        this.pageType = this.activeRoute.snapshot.data.type;
        this.email = localStorage.getItem('email');
        this.phoneNo = localStorage.getItem('phoneNo');
        this.getUserInformation(localStorage.getItem('userId'));
        this.redirectPageToDashboard();
        this.activeRoute.queryParams.subscribe(param => {
            if (param.planName) {
                this.planName = param.planName;
            }
            if (param.userCount) {
                this.userCount = param.userCount;
            }
            if (param.amount) {
                this.amount = param.amount;
            }
            if (param.currencyCode) {
                this.currencyCode = param.currencyCode;
            }
        });
        if (this.pageType === 0) {
            this.navService.gaEvent({
                action: 'submit',
                category: 'Payment_successful',
                label: `Email: ${this.email} PhoneNo.: ${this.phoneNo}`,
                value: null
            });
        }
        if (this.pageType === 1) {
            this.navService.gaEvent({
                action: 'submit',
                category: 'Payment_failed',
                label: `Email: ${this.email} PhoneNo.: ${this.phoneNo}`,
                value: null
            });
        }
        if (this.pageType === 3) {
            this.navService.gaEvent({
                action: 'submit',
                category: 'buy_now_trial_expired',
                label: `Email: ${this.email} PhoneNo.: ${this.phoneNo}`,
                value: null
            });
        }
    }

    getUserInformation(userId) {
        this._userService.getUserInfo(userId).then(res => {
            localStorage.setItem('isFreeTrialSubscription', res.data.isFreeTrialSubscription);
            localStorage.setItem('isActiveSubscription', res.data.isActiveSubscription);
            this.subsPayService.updateSubscriptionPlan$.next();
        });
    }

    redirectPageToDashboard() {
        if (this.pageType !== 3 && this.pageType !== 1) {
            setTimeout(_ => { this.router.navigate([ "/dashboard" ]) }, 20000);
        }
        if (this.pageType === 1) {
            setTimeout(_ => { this.router.navigate([ "/subscriptions" ]) }, 20000);
        }
    }

    gotoMySubscriptions() {
        this.router.navigate([ '/subscriptions' ]);
    }

    gotoSubscriptions() {
        this.router.navigate([ '/buy-subscriptions' ]);
    }

}