import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SubscriptionsList } from '../../models/subscriptions';
import { Router } from '@angular/router';
import { UserService } from '../../services/userDashboard/user.service';
import { UserDetails } from '../../models/user-details';
import { SubscriptionPaymentsService } from '../../services/subscriptions-payments.service';
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
        private commonService: CommonService
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

    unsubscribePlan(id: number) {
        const obj = {
            subscriptionId: id
        };
        this.subsPayService.postSubscriptionUnsubscribe(obj).then(res => {
            if (res.data) {
                this._router.navigate([ "/dashboard" ])
            }
        });
    }

    choosePlan(type, planId: number, offerId: number, price: number, planEncryptId: string, planPricingEncryptId: string) {

        let obj = {
            planId: planId,
            planPricingId: price,
            offerId: offerId,
            isTrial: 0
        };

        type === '0' ? obj.isTrial = 0 : obj.isTrial = 1;

        this.subsPayService.postSubscriptionPaymentInitiate(obj).then(res => {

            if (type === '0') {
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

    showAllFeatures(event) {
        event.currentTarget.children[ 0 ].children[ 1 ].innerHTML === 'keyboard_arrow_down' ? event.currentTarget.children[ 0 ].children[ 1 ].innerHTML = 'keyboard_arrow_up' : event.currentTarget.children[ 0 ].children[ 1 ].innerHTML = 'keyboard_arrow_down';
        event.currentTarget.nextElementSibling.classList.toggle('f-hide');
    }

}