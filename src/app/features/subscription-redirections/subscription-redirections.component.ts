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
    }

    redirectPageToDashboard() {
        setTimeout(_ => { this.router.navigate([ "/dashboard" ]) }, 10000);
    }

}