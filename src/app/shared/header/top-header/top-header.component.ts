import { AppNavigationService } from './../../services/navigation.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { SubscriptionPaymentsService } from '../../services/subscriptions-payments.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationInt } from '../../models/notification';
import { CommonService } from '../../services/commonService';
import { UserService } from '../../services/user.service';

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
  accountOwner: any;
  users: any;
  isPlanAvailable: any;
  isBookNow: number;
  email: string;
  phoneNo: string;
  constructor(
    private commonService: CommonService,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    private router: Router,
    private subsPayService: SubscriptionPaymentsService,
    private navService: AppNavigationService
  ) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.email = localStorage.getItem('email');
    this.phoneNo = localStorage.getItem('phoneNo');
    this.userId = Number(localStorage.getItem('userId'));
    this.userName = localStorage.getItem('userName');
    this.url = localStorage.getItem('profileUrl');
    this.isWhatsappIconDisplay = localStorage.getItem("callingCode");
    this.isPlanAvailable = Number(localStorage.getItem('isPlanAvailable'));
    this.accountOwner = Number(localStorage.getItem('accountOwner'));
    this.isBookNow = Number(localStorage.getItem('isFreeTrialSubscription'));

    this.getNotifications();
    this.startSubscriptions();

    const source = interval(30000);
    this.subscription = source.subscribe(val => { this.getNotifications(); this.startSubscriptions() });

    this.checkFreeTrial();
  }

  choosePlan() {
    this.router.navigate([ '/subscriptions' ]);
  }

  checkFreeTrial() {
    const data = this.subscriptionsData;
    if (data && data.planFrequencyList && data.planFrequencyList.length) {
      let checked = 0;
      for (let i = 0; i < data.planFrequencyList.length; i++) {
        for (let x = 0; x < data.planFrequencyList[ i ].planList.length; x++) {
          if (checked == 0) {
            if (data.planFrequencyList[ i ].planList[ x ].isTrialActive === 1) {
              checked = 1;
              this.isFreeTrial = data.planFrequencyList[ i ].planList[ x ];
              const dates = data.planFrequencyList[ i ].planList[ x ].activeSubscription
              let tDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
              data.planFrequencyList[ i ].planList[ x ][ 'daysLeft' ] = this.setTrialDaysLeft(tDate, dates.trialPeriodEndDate);
            }
          }
        }
      }
    }
    if (Number(localStorage.getItem('isFreeTrialSubscription')) === 1) {
      this.isFreeTrialActivate = true;
    }
  }

  setTrialDaysLeft(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  }

  getUpdatedSubscription() {
    this.subsPayService.getUpdatedSubscriptionData().then(res => {
      this.subscriptionsData = res;
      this.checkFreeTrial();
    });
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
      }),
      this.subsPayService.updateSubscriptionPlan$.subscribe(_ => {
        this.getUpdatedSubscription();
        if (Number(localStorage.getItem('isFreeTrialSubscription')) === 1) {
          this.isFreeTrialActivate = true;
        } else {
          this.isFreeTrialActivate = false;
        }
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

  goToHome() {
    this.router.navigate([ '/dashboard' ]);
  }

  openCallendly() {
    this.commonService.openCallendly(this.email, this.phoneNo);
  }

}