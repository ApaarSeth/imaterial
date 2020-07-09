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
import { CommonService } from '../../services/commonService';

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
    isMobile: boolean;

    constructor(
        private _router: Router,
        private _userService: UserService,
        private subsPayService: SubscriptionPaymentsService,
        private commonService: CommonService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
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

    unsubscribePlan() {

    }

    choosePlan(type, planId: number, offerId: string, price: number, planEncryptId: string, planPricingEncryptId: string) {

        let obj = {
            planId: planId,
            planPricingId: price,
            offerId: null,
            isTrial: 0
        };

        type === '0' ? obj.isTrial = 0 : obj.isTrial = 1;

        this.subsPayService.postSubscriptionPaymentInitiate(obj).then(res => {

            let data = {
                customerEmail: this.users.email,
                customerName: this.users.firstName + ' ' + this.users.lastName,
                customer_identifier: this.users.organizationId,
                orderId: res.data.transactionId,
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

            if (type === '0') {
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