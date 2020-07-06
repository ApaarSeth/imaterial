import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SubscriptionsList } from '../../models/subscriptions';
import { Router } from '@angular/router';
import { UserService } from '../../services/userDashboard/user.service';
import { UserDetails } from '../../models/user-details';
import { SubscriptionPaymentsService } from '../../services/subscriptions-payments.service';
import { SubscriptionsPayments } from '../../../shared/models/subscription-payments';
import { Utils } from '../../helpers/utils';
import { FormBuilder } from '@angular/forms';
import { API } from '../../constants/configuration-constants';

@Component({
    selector: 'app-subscriptions',
    templateUrl: './subscriptions.component.html'
})

export class SubscriptionsComponent implements OnInit {

    @Input('data') data: SubscriptionsList;
    @Input('trialAction') trialAction: boolean;
    @Output() startTrial = new EventEmitter<any>();
    users: UserDetails;

    subscriptionsData: any;

    constructor(
        private _router: Router,
        private _userService: UserService,
        private subsPayService: SubscriptionPaymentsService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.getUserInformation(localStorage.getItem('userId'));
        this.subscriptionsData = this.data.planFrequencyList;
    }

    startTrialTrigger() {
        this.startTrial.emit(true);
    }

    sortFeaturesObjList(data) {
        let availArr = [], notAvailArr = [];
        data.forEach(itm => {
            itm.available ? availArr.push(itm) : notAvailArr.push(itm);
        });
        return availArr.concat(notAvailArr);
    }

    getUserInformation(userId) {
        this._userService.getUserInfo(userId).then(res => {
            this.users = res.data ? res.data[ 0 ] : null;
        });
    }

    choosePlan(planId: number, offerId: string, price: number, planEncryptId: string, planPricingEncryptId: string) {

        const obj = {
            planId: planId,
            planPricingId: price,
            offerId: null,
            isTrial: 0
        };

        this.subsPayService.postSubscriptionPaymentInitiate(obj).then(res => {

            console.log(res);

            let data = {
                customerEmail: this.users.email,
                customerName: this.users.firstName + ' ' + this.users.lastName,
                customer_identifier: 'test2',
                orderId: 'SDFSDVXCVVDS3333DD35566',
                promoCode: 'DD234Q',
                validUpto: '12-09-2020',
                redirectUrl: res.data.redirectUrl,
                cancelUrl: res.data.cancelUrl,
                failureUrl: res.data.failureUrl,
                subscriptionPlanRefId: planEncryptId,
                subscriptionPlanPriceRefId: planPricingEncryptId,
                // subscriptionPlanRefId: 'imPrem',
                // subscriptionPlanPriceRefId: '100INR',
                serviceName: 'iMaterial'
            };

            console.log(JSON.stringify(data));

            this.postToExternalSite(data);

        });

    }

    private postToExternalSite(dataToPost): void {

        const form = window.document.createElement('form');

        Object.entries(dataToPost).forEach((field: any[]) => {
            form.appendChild(this.createHiddenElement(field[ 0 ], field[ 1 ]));
        });

        form.setAttribute('target', '_self');
        form.setAttribute('method', 'post');

        form.setAttribute('action', ('https://faf51166b6b4.ngrok.io/payment/') + API.POST_SUBSCRIPTIONPAYMENTGATEWAY);
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