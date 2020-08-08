import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'buy-subcriptions',
    templateUrl: './buy-subscriptions.component.html'
})

export class BuySubscriptionsComponent implements OnInit {
    subscriptionsData: any;

    constructor(
        private activateRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.subscriptionsData = this.activateRoute.snapshot.data.subsData;
    }
}