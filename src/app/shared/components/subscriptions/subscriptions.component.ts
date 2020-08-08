import { CancelSubscriptionDialog } from './subscription-cancel/cancel-subscription-dialog.component';
import { MatDialog } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnDestroy } from "@angular/core";
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
    trialDays: string;

    isFreeTrialSubscription: any;
    isActiveSubscription: any;

    constructor(
        private _router: Router,
        private _userService: UserService,
        private subsPayService: SubscriptionPaymentsService,
        private commonService: CommonService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
        this.getUserInformation(localStorage.getItem('userId'));
        this.isFreeTrialSubscription = Number(localStorage.getItem('isFreeTrialSubscription'));
        this.isActiveSubscription = Number(localStorage.getItem('isActiveSubscription'));
        this.subscriptionsData = this.data.planFrequencyList;
        this.getTrialDays(this.subscriptionsData);
    }

    getTrialDays(subs) {

        if (subs) {
            const days = subs[ 0 ].trialDays;
            if (days < 30) {
                this.trialDays = days + ' DAYS';
            } else if (days == 30) {
                this.trialDays = '1 MONTH';
            } else if (days > 30 && days < 60) {
                this.trialDays = days + ' DAYS';
            } else {
                this.trialDays = '2 MONTHS';
            }
        }
    }

    getSubsciptionDiscounted(discount, price) {
        // return (Number(price) * (discount / 100));
        return Number(price) - (Number(price) * (discount / 100));
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
            this.isFreeTrialSubscription = res.data[ 0 ].isFreeTrialSubscription;
            this.isActiveSubscription = res.data[ 0 ].isActiveSubscription;
        });
    }

    unsubscribePlan(id: number) {
        const dialogRef = this.dialog.open(CancelSubscriptionDialog, {
            width: "768px",
        })
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                const obj = {
                    subscriptionId: id
                };
                this.subsPayService.postSubscriptionUnsubscribe(obj).then(res => {
                    if (res.status === 1) {
                        this._router.navigate([ "/subscriptions/unsubscribe" ])
                    }
                });
            }
        })
    }

    choosePlan(type, planId, offerId, price, planEncryptId, planPricingEncryptId) {
        this.subsPayService.chooseSubcriptionPlan(type, planId, offerId, price, planEncryptId, planPricingEncryptId, this.users);
    }

    showAllFeatures(event) {
        event.currentTarget.children[ 0 ].children[ 1 ].innerHTML === 'keyboard_arrow_down' ? event.currentTarget.children[ 0 ].children[ 1 ].innerHTML = 'keyboard_arrow_up' : event.currentTarget.children[ 0 ].children[ 1 ].innerHTML = 'keyboard_arrow_down';
        event.currentTarget.nextElementSibling.classList.toggle('f-hide');
    }

    getClassName(planName) {
        return planName.toLowerCase() + '-head';
    }

    contactSales() {
        this.subsPayService.getContactSales();
    }

}