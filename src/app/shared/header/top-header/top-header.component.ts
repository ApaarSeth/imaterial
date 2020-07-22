import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationInt } from 'src/app/shared/models/notification';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { Subscription, interval } from 'rxjs';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { TokenService } from '../../services/token.service';
import { SubscriptionPaymentsService } from '../../services/subscriptions-payments.service';

@Component({
  selector: 'app-top-header',
  templateUrl: './top-header.component.html'
})

export class TopHeaderComponent implements OnInit {

  notifClicked: boolean = false;
  userId: number;
  @Input('menu') menu: MatSidenav;
  unreadnotificationLength: number = null;
  allnotificationLength: number = null;
  userName: string;
  url: string;

  notificationObj: NotificationInt[] = [];
  readnotification: NotificationInt[] = [];
  unreadnotification: NotificationInt[] = [];
  subscription: Subscription;
  subscriptions: Subscription[] = [];
  newunreadMessage: number = null;
  isWhatsappIconDisplay: string;
  isMobile: boolean;
  @Input('subscriptionsData') subscriptionsData: any;

  isFreeTrial: any;
  isFreeTrialActivate: boolean;

  isActiveSubscription: boolean;
  users: UserService;

  constructor(
    private commonService: CommonService,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    private router: Router,
    private subsPayService: SubscriptionPaymentsService
  ) { }

  ngOnInit() {

    this.isMobile = this.commonService.isMobile().matches;

    this.isActiveSubscription = true;

    // localStorage.getItem('isActiveSubscription') === '0' ? this.isActiveSubscription = false : this.isActiveSubscription = true;

    this.userId = Number(localStorage.getItem('userId'));
    this.userName = localStorage.getItem('userName');
    this.url = localStorage.getItem('profileUrl');
    this.isWhatsappIconDisplay = localStorage.getItem("countryCode");

    this.getUserInformation(this.userId);

    this.getNotifications();
    this.startSubscriptions();

    const source = interval(30000);
    this.subscription = source.subscribe(val => { this.getNotifications(); this.startSubscriptions() });

    this.checkFreeTrial();
  }

  getUserInformation(userId) {
    this._userService.getUserInfo(userId).then(res => {
      this.users = res.data ? res.data[ 0 ] : null;
    });
  }

  checkFreeTrial() {
    const data = this.subscriptionsData;
    if (data && data.planFrequencyList.length) {
      let checked = 0;
      for (let i = 0; i < data.planFrequencyList.length; i++) {
        for (let x = 0; x < data.planFrequencyList[ i ].planList.length; x++) {
          if (checked == 0) {
            if (data.planFrequencyList[ i ].planList[ x ].isTrialActive === 1) {
              checked = 1;
              this.isFreeTrial = data.planFrequencyList[ i ].planList[ x ];
              const dates = data.planFrequencyList[ i ].planList[ x ].activeSubscription
              data.planFrequencyList[ i ].planList[ x ][ 'daysLeft' ] = this.setTrialDaysLeft(dates.trialPeriodStartDate, dates.trialPeriodEndDate);
              this.isFreeTrialActivate = true;
            }
          }
        }
      }
    }
  }


  choosePlan() {
    this.subsPayService.chooseSubcriptionPlan('0', this.isFreeTrial.planId, this.isFreeTrial.offerId, this.isFreeTrial.planPricingId, this.isFreeTrial.planEncryptId, this.isFreeTrial.planPricingEncryptId, this.users);
  }

  setTrialDaysLeft(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  }

  startSubscriptions() {
    this.subscriptions.push(
      this.commonService.onUserUpdate$.subscribe(notificationLength => {
        if (this.unreadnotificationLength == null) {
          this.unreadnotificationLength = notificationLength;
        }
        //this.newunreadMessage = null;
        if (notificationLength > this.unreadnotificationLength) {
          this.newunreadMessage = notificationLength - this.unreadnotificationLength;
          this._snackBar.open('You have ' + this.newunreadMessage + ' new notifications', '', {
            duration: 2000,
            panelClass: [ 'success-snackbar' ],
            verticalPosition: 'bottom'
          });
        }
        this.unreadnotificationLength = notificationLength;
      }),

      this._userService.UpdateProfileImage.subscribe(image => {
        this.url = image;
        localStorage.setItem('profileUrl', this.url);
      })
    );
  }

  getNotifications() {
    this.commonService.getNotification(this.userId);
  }

  getNotificationFromLocalstorage() {
    this.allnotificationLength = Number(localStorage.getItem('all_notification'));
    this.unreadnotificationLength = Number(localStorage.getItem('un_read_notification'));
  }

  openMenu() {
    this.menu.open();
  }

  logout() {
    this.router.navigate([ '/auth/login' ]).then(_ => {
      localStorage.clear();
      // this.tokenService.setAuthResponseData({ serviceToken: null, role: null, userId: null, orgId: null });
    });
  }

  goToProfile() {
    this.router.navigate([ '/profile-account' ]);
  }

  goToMyPlans() {
    this.router.navigate([ '/subscriptions' ]);
  }
  openDiv() {
    if (this.notifClicked == true) {
      this.getNotificationData();
      this.notifClicked = false;
      this.newunreadMessage = null;
    } else {
      this.getNotificationData();
      this.newunreadMessage = null;
      this.notifClicked = true;
    }
  }
  getNotificationData() {
    this.commonService.getNotificationData(this.userId).then(res => {
      this.notificationObj = [];
      this.notificationObj = res.data;
      this.unreadnotification = [];
      this.readnotification = [];
      this.unreadnotificationLength = 0;
      this.allnotificationLength = 0;
      if (this.notificationObj) {
        this.notificationObj.forEach(element => {
          if (element.read == 0) {
            this.unreadnotification.push(element);
          }
          else if (element.read == 1) {
            this.readnotification.push(element);
          }
        })

        if (this.unreadnotification && this.unreadnotification.length > 0) {
          this, this.unreadnotificationLength = this.unreadnotification.length;
          //  localStorage.setItem("un_read_notification",this.unreadnotificationLength.toString());
        }


        if (this.readnotification && this.unreadnotification && this.readnotification.length > 0 && this.unreadnotification.length > 0) {
          this.allnotificationLength = this.readnotification.length + this.unreadnotification.length;
          //  localStorage.setItem("all_notification",this.allnotificationLength.toString());
        }

      }
    })
  }

  closeDialog() {
    this.notifClicked = false;
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
    this.subscription.unsubscribe();
  }
}