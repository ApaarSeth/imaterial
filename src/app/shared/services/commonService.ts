import { AppNavigationService } from './navigation.service';
import { Injectable } from '@angular/core';
import { NotificationInt } from '../models/notification';
import { API } from '../constants/configuration-constants';
import { DataService } from './data.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { ProjetPopupData } from '../models/project-details';
import { DoubleConfirmationComponent } from '../dialogs/double-confirmation/double-confirmation.component';
import { MatDialog } from "@angular/material/dialog";
import { AddProjectComponent } from '../dialogs/add-project/add-project.component';

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
    public dialog: MatDialog,
    private mediaMatcher: MediaMatcher,
    private navService: AppNavigationService
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

  getCountry(skipLoader?: boolean) {
    let callingCode = localStorage.getItem('callingCode')
    return this.dataService.getRequest(API.COUNTRYCODE, null, { skipLoader: skipLoader });
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
      .getRequest(API.GETCITYANDSTATEBYCOUNTRY(pin, cId), null, { skipLoader: true })
      .then(res => {
        return res;
      });
  }

  getSubscriptionPlan() {
    return this.dataService.getRequest(API.GETSUBSCRIPTIONPLAN);
  }
  pushNotificationData(data) {
    return this.dataService.sendPostRequest(API.PUSHNOTIFICATIONDATA, data)
  }

  getMenuData() {
    return this.dataService.getRequest(API.GET_MENU);
  }

  getSuppliers(organizationId: number, skipLoader?: boolean) {
    return this.dataService.getRequest(API.GETSUPPLIERS(organizationId), null, { skipLoader });
  }

  getMaterials() {
    return this.dataService.getRequest(API.GETDISTINCTMATERIALS);
  }

  openCallendly(email, phoneNo) {
    this.navService.gaEvent({
      action: 'submit',
      category: 'Book_demo',
      label: `Email: ${email} PhoneNo.: ${phoneNo}`,
      value: null
    });
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = 'https://calendly.com/mm_support/discovery_call';
    link.setAttribute('visibility', 'hidden');
    link.click();
  }

}


