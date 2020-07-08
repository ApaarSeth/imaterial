import { Component, OnInit } from "@angular/core";
import { CommonService } from 'src/app/shared/services/commonService';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'subscription-redirections',
    templateUrl: './subscription-redirections.component.html'
})

export class SubscriptionRedirectionsComponent implements OnInit {

    isMobile: boolean;
    pageType: number;

    constructor(
        private commonService: CommonService,
        private activeRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
        this.pageType = this.activeRoute.snapshot.data.type;
    }

}