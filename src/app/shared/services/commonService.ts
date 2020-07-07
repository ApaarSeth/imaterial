import { Injectable } from '@angular/core';
import { NotificationInt } from '../models/notification';
import { API } from '../constants/configuration-constants';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { Currency } from '../models/currency';
import { MediaMatcher } from '@angular/cdk/layout';
@Injectable({
  providedIn: "root"
})


export class CommonService {
  notificationObj: NotificationInt[] = [];
  readnotification: NotificationInt[] = [];
  unreadnotification: NotificationInt[] = [];
  allnotificationLength: number = null;
  unreadnotificationLength: number = null;
  onUserUpdate$ = new Subject<number>();
  materialAdded = new Subject<boolean>();
  baseCurrency = new BehaviorSubject(null);
  XSmall: string = '(max-width: 599px)';
  constructor(
    private dataService: DataService,
    private _router: Router,
    private mediaMatcher: MediaMatcher
  ) { }

  formatDate(oldDate): string {
    let newDate = new Date(oldDate);
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    return String(newDate);
  }

  checkDate(data) {
    let date = new Date(data)
    let dummyMonth = date.getMonth() + 1;
    const year = date.getFullYear().toString();
    const month = dummyMonth > 9 ? dummyMonth.toString() : "0" + dummyMonth.toString();
    const day = date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();
    return year + "-" + month + "-" + day;
  }
  getBaseCurrency() {
    return this.dataService.getRequest(API.BASECURRENCY)
  }
  getNotification(userId) {
    this.dataService.getRequest(API.GET_NOTIFICATIONS(userId), null, { skipLoader: true }).then(res => {
      this.notificationObj = res.data;
      this.unreadnotification = [];
      this.readnotification = [];
      // localStorage.removeItem("all_notification");
      // localStorage.removeItem("un_read_notification");

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
          this.unreadnotificationLength = 0;
          this.unreadnotificationLength = this.unreadnotification.length;
          // localStorage.setItem("un_read_notification",this.unreadnotificationLength.toString());
          this.onUserUpdate$.next(this.unreadnotificationLength);
        }


        if (this.readnotification && this.unreadnotification && this.readnotification.length > 0 && this.unreadnotification.length > 0) {
          this.allnotificationLength = 0;
          this.allnotificationLength = this.readnotification.length + this.unreadnotification.length;
          //  localStorage.setItem("all_notification",this.allnotificationLength.toString());
        }

      }
    })
  }
  getNotificationData(userId) {
    return this.dataService.getRequest(API.GET_NOTIFICATIONS(userId), null, { skipLoader: true });
  }

  getMyMaterial(type: string) {
    return this.dataService.getRequest(API.MYCUSTOMMATERIAL(type))
  }
  getFormatedDate(formatdate) {
    let date = new Date(this.formatDate(formatdate))
    let dummyMonth = date.getMonth() + 1;
    const year = date.getFullYear().toString();
    const month = dummyMonth > 9 ? dummyMonth.toString() : "0" + dummyMonth.toString();
    const day = date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();
    return year + "-" + month + "-" + day;
  }

  getCurrency() {
    return this.dataService.getRequest(API.CURRENCY);
  }

  getCountry() {
    let callingCode = localStorage.getItem('countryCode')
    return this.dataService.getRequest(API.COUNTRYCODE, null, { skipLoader: callingCode === '+91' ? false : true });
  }

  poTaxesList() {
    return this.dataService.getRequest(API.GETPOTAXESLIST)
  }
  taxesList(rfqId) {
    return this.dataService.getRequest(API.GETTAXESLIST(rfqId))
  }

  isMobile() {
    return this.mediaMatcher.matchMedia(this.XSmall);
  }

  getPincodeInternational(pin: number, cId: number) {
    return this.dataService
      .getRequest(API.GETCITYANDSTATEBYCOUNTRY(pin, cId))
      .then(res => {
        return res;
      });
  }

  pushNotificationData(data) {
    return this.dataService.sendPostRequest(API.PUSHNOTIFICATIONDATA, data)
  }

}


