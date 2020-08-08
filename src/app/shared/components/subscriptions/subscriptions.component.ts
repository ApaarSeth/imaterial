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
import { AppNotificationService } from '../../services/app-notification.service';

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
        private dialog: MatDialog,
        private notifier: AppNotificationService
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
            localStorage.setItem('isFreeTrialSubscription', this.isFreeTrialSubscription);
            localStorage.setItem('isActiveSubscription', this.isActiveSubscription);
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
                        this.getUpdatedSubscription();
                        this.notifier.snack("You have unsubscribed successfully");
                        // this._router.navigate([ "/subscriptions/unsubscribe" ])
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

    getUpdatedSubscription() {

        this.commonService.getSubscriptionPlan().then(res => {
            let subsdata = res.data;
            let cstmPlan = {
                "planName": "Custom", "activeSubscription": null, "planSortSeq": 3, "planFeatureList": null, "planFeatureObjList": [ { "featureName": "Customizable", "available": true },
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
                { "featureName": "And a lot more..", "available": true } ]
            };
            subsdata.planFrequencyList.forEach(item => {
                item.planList.push(cstmPlan);
            });
            this.subscriptionsData = subsdata;
        });

    }

}