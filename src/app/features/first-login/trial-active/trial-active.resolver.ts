import { Injectable } from '@angular/core';
import { UserService } from './../../../shared/services/user.service';
import { SubscriptionPaymentsService } from './../../../shared/services/subscriptions-payments.service';
import { Resolve } from '@angular/router';

@Injectable()

export class TrialActiveResolver implements Resolve<any>{

    data: any;

    constructor(
        private subsPayService: SubscriptionPaymentsService,
        private _userService: UserService
    ) {
        this.data = {
            "planId": 2,
            "planPricingId": 4,
            "offerId": null,
            "isTrial": 1,
            "planEncryptId": '',
            "planPricingEncryptId": ''
        }
    }

    resolve() {
        this.subsPayService.postSubscriptionPaymentInitiate(this.data).then(res => {

            if (res.data) {
                this._userService.getUserInfo(localStorage.getItem('userId')).then(res => {
                    localStorage.setItem('isFreeTrialSubscription', res.data.isFreeTrialSubscription);
                    localStorage.setItem('isActiveSubscription', res.data.isActiveSubscription);
                    this.subsPayService.updateSubscriptionPlan$.next();
                    return true;
                });
            }

        })
    }

}