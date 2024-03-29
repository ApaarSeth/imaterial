import { AppNavigationService } from './../../services/navigation.service';
import { CancelSubscriptionDialog } from './subscription-cancel/cancel-subscription-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnDestroy } from "@angular/core";
import { SubscriptionsList } from '../../models/subscriptions';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
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
    email: string;
    phoneNo: string;

    constructor(
        private _router: Router,
        private _userService: UserService,
        private subsPayService: SubscriptionPaymentsService,
        private commonService: CommonService,
        private dialog: MatDialog,
        private notifier: AppNotificationService,
        private navService: AppNavigationService
    ) { }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
        this.email = localStorage.getItem('email');
        this.phoneNo = localStorage.getItem('phoneNo');
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
            this.users = res.data ? res.data : null;
            this.isFreeTrialSubscription = res.data.isFreeTrialSubscription;
            this.isActiveSubscription = res.data.isActiveSubscription;
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

    choosePlan(type, planId, offerId, price, planEncryptId, planPricingEncryptId, planName) {
        if (planName === 'Basic') {
            this.navService.gaEvent({
                action: 'submit',
                category: 'buy_now_basic',
                label: `Email: ${this.email} PhoneNo.: ${this.phoneNo}`,
                value: null
            });
        }
        if (planName === 'Premium') {
            this.navService.gaEvent({
                action: 'submit',
                category: 'buy_now_premium',
                label: `Email: ${this.email} PhoneNo.: ${this.phoneNo}`,
                value: null
            });
        }
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
        this.subsPayService.getContactSales().then(res => {
            if (res) {
                this.notifier.snack(res.message);
                this.navService.gaEvent({
                    action: 'submit',
                    category: 'custom_plan',
                    label: `Email: ${this.email} PhoneNo.: ${this.phoneNo}`,
                    value: null
                });
            }
        });
    }


    getUpdatedSubscription() {
        this.subsPayService.getUpdatedSubscriptionData().then(res => {
            this.subscriptionsData = res;
        });
    }

}