import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'profile-subscriptions',
    templateUrl: './profile-subscriptions.component.html'
})

export class ProfileSubscriptionsComponent implements OnInit {

    subscriptionsData: any;

    constructor(
        private _router: Router,
        private activateRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.subscriptionsData = this.activateRoute.snapshot.data.subsData;
    }

    startTrialEvent() {
        this._router.navigate([ 'profile/add-user' ]);
    }

}