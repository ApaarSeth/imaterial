import { Component, OnInit } from "@angular/core";
import { CommonService } from 'src/app/shared/services/commonService';
import { ActivatedRoute, Router } from '@angular/router';

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


    constructor(
        private commonService: CommonService,
        private activeRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
        this.pageType = this.activeRoute.snapshot.data.type;
        if (this.pageType !== 3) {
            this.redirectPageToDashboard();
        }
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
    }

    redirectPageToDashboard() {
        setTimeout(_ => { this.router.navigate([ "/dashboard" ]) }, 20000);
    }

    gotoSubscriptions() {
        this.router.navigate([ 'profile/subscriptions' ]);
    }

}