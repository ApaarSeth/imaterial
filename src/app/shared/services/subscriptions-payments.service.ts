import { Injectable } from "@angular/core";
import { DataService } from './data.service';
import { SubscriptionsPayments } from '../models/subscription-payments';
import { API } from '../constants/configuration-constants';
import { DataServiceOptions } from '../models/data-service-options';
import { Utils } from '../helpers/utils';
import { Router } from '@angular/router';

@Injectable({
    providedIn: "root"
})

export class SubscriptionPaymentsService {
    constructor(
        private dataService: DataService,
        private _router: Router
    ) { }

    postSubscriptionPaymentInitiate(data) {
        return this.dataService.sendPostRequest(API.POST_SUBSCRIPTIONINITIATE, data);
    }

    postSubscriptionUnsubscribe(data) {
        return this.dataService.sendPostRequest(API.POST_SUBSCRIPTION_UNSUBSCRIBE, data);
    }

    chooseSubcriptionPlan(type, planId: number, offerId: number, price: number, planEncryptId: string, planPricingEncryptId: string, users: any) {

        let obj = {
            planId: planId,
            planPricingId: price,
            offerId: offerId,
            isTrial: 0
        };

        type === '0' ? obj.isTrial = 0 : obj.isTrial = 1;

        this.postSubscriptionPaymentInitiate(obj).then(res => {

            if (type === '0') {
                let data = {
                    customerEmail: users.email,
                    customerName: users.firstName + ' ' + users.lastName,
                    customer_identifier: users.organizationId,
                    // orderId: res.data.transactionId,
                    orderId: res.data.orderId,
                    // promoCode: 'DD234Q',
                    validUpto: res.data.endDate,
                    startDt: res.data.startDate,
                    redirectUrl: res.data.redirectUrl,
                    cancelUrl: res.data.cancelUrl,
                    failureUrl: res.data.failureUrl,
                    subscriptionPlanRefId: planEncryptId,
                    subscriptionPlanPriceRefId: planPricingEncryptId,
                    serviceName: 'iMaterial'
                };
                this.postToExternalSite(data);
            } else {
                if (res.data) {
                    this._router.navigate([ "/profile/add-user" ]);
                }
            }

        });

    }

    private postToExternalSite(dataToPost): void {

        const form = window.document.createElement('form');

        Object.entries(dataToPost).forEach((field: any[]) => {
            form.appendChild(this.createHiddenElement(field[ 0 ], field[ 1 ]));
        });

        form.setAttribute('target', '_self');
        form.setAttribute('method', 'post');

        form.setAttribute('action', ('https://dev-payment.buildsupply.io/payment/') + API.POST_SUBSCRIPTIONPAYMENTGATEWAY);
        window.document.body.appendChild(form);
        form.submit();

    }

    private createHiddenElement(name: string, value: string): HTMLInputElement {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('name', name);
        hiddenField.setAttribute('value', value);
        hiddenField.setAttribute('type', 'hidden');
        return hiddenField;
    }

}