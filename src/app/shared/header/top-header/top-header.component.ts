import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationInt } from 'src/app/shared/models/notification';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { Subscription, interval } from 'rxjs';
import { MatSnackBar, MatSidenav } from '@angular/material';
import { TokenService } from '../../services/token.service';

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
  constructor(
    private commonService: CommonService,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit() {

    this.userId = Number(localStorage.getItem('userId'));
    this.userName = localStorage.getItem('userName');
    this.url = localStorage.getItem('profileUrl');

    this.getNotifications();
    this.startSubscriptions();

    const source = interval(30000);
    this.subscription = source.subscribe(val => { this.getNotifications(); this.startSubscriptions() });
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
            panelClass: ['success-snackbar'],
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
    this.router.navigate(['/auth/login']).then(_ => {
      localStorage.clear();
      // this.tokenService.setAuthResponseData({ serviceToken: null, role: null, userId: null, orgId: null });
    });
  }
  goToProfile() {
    this.router.navigate(['/profile-account']);
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