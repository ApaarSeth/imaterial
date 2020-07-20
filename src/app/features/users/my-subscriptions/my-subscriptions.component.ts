import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'my-subcriptions',
    templateUrl: './my-subscriptions.component.html'
})

export class MySubscriptionsComponent implements OnInit {
    subscriptionsData: any;

    constructor(
        private activateRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.subscriptionsData = this.activateRoute.snapshot.data.subsData;
    }
}