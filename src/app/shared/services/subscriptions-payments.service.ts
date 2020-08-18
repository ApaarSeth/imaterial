import { Injectable } from "@angular/core";
import { DataService } from './data.service';
import { SubscriptionsPayments } from '../models/subscription-payments';
import { API } from '../constants/configuration-constants';
import { DataServiceOptions } from '../models/data-service-options';
import { Utils } from '../helpers/utils';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from './user.service';
import { AppNotificationService } from './app-notification.service';
import { CommonService } from './commonService';

@Injectable({
    providedIn: "root"
})

export class SubscriptionPaymentsService {

    updateSubscriptionPlan$ = new Subject<any>();

    constructor(
        private dataService: DataService,
        private _router: Router,
        private _userService: UserService,
        private notifier: AppNotificationService,
        private commonService: CommonService
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
                    // this._router.navigate([ "/profile/add-user" ]);

                    // this.getUserInformation(localStorage.getItem('userId'));
                    this._userService.getUserInfo(localStorage.getItem('userId')).then(res => {
                        localStorage.setItem('isFreeTrialSubscription', res.data[0].isFreeTrialSubscription);
                        localStorage.setItem('isActiveSubscription', res.data[0].isActiveSubscription);
                        this.updateSubscriptionPlan$.next();
                        this._router.navigate(["/dashboard"]);
                        this.notifier.snack('Your free trial has been started successfully!');
                    });
                }
            }

        });

    }

    private postToExternalSite(dataToPost): void {

        const form = window.document.createElement('form');

        Object.entries(dataToPost).forEach((field: any[]) => {
            form.appendChild(this.createHiddenElement(field[0], field[1]));
        });

        form.setAttribute('target', '_self');
        form.setAttribute('method', 'post');

        form.setAttribute('action', this.dataService.paymentUrl + API.POST_SUBSCRIPTIONPAYMENTGATEWAY);
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

    getContactSales() {
        return this.dataService.getRequest(API.GET_CONTACTSALES);
    }

    getUserInformation(userId) {
        this._userService.getUserInfo(userId).then(res => {
            localStorage.setItem('isFreeTrialSubscription', res.data[0].isFreeTrialSubscription);
            localStorage.setItem('isActiveSubscription', res.data[0].isActiveSubscription);
            this.updateSubscriptionPlan$.next();
        });
    }

    getUpdatedSubscriptionData(): Promise<any> {
        return this.commonService.getSubscriptionPlan().then(res => {
            let subsdata = res.data;
            let cstmPlan = {
                "planName": "Custom", "activeSubscription": null, "planSortSeq": 3, "planFeatureList": null, "planFeatureObjList": [{ "featureName": "Customizable", "available": true },
                { "featureName": "Supplier Management", "available": true },
                { "featureName": "Bill of Materials(BOM)", "available": true },
                { "featureName": "Purchase Requisitions", "available": true },
                { "featureName": "Request for Price(RFP)", "available": true },
                { "featureName": "Purchase Orders", "available": true },
                { "featureName": "Good Receipt Notes(GRN)", "available": true },
                { "featureName": "Material Issuance", "available": true },
                { "featureName": "Payment Record", "available": true },
                { "featureName": "Inventory Records", "available": true },
                { "featureName": "PO ShortClose", "available": true },
                { "featureName": "Comprehensive Dashboards", "available": true },
                { "featureName": "Real Time Status Tracking", "available": true },
                { "featureName": "Currency Administration", "available": true },
                { "featureName": "Intersite Transfer", "available": true },
                { "featureName": "Vendor Rating", "available": true },
                { "featureName": "Image Integration", "available": true },
                { "featureName": "Reports & Analytics", "available": true },
                { "featureName": "Aggregated Purchase", "available": true },
                { "featureName": "On Demand Dedicated Onboarding", "available": true },
                { "featureName": "And a lot more..", "available": true }]
            };
            subsdata.planFrequencyList.forEach(item => {
                item.planList.push(cstmPlan);
            });
            return subsdata.planFrequencyList;
        });
    }

}