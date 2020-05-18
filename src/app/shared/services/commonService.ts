import { Injectable } from '@angular/core';
import { NotificationInt } from '../models/notification';
import { API } from '../constants/configuration-constants';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
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
  constructor(private dataService: DataService,
    private _router: Router) { }

  formatDate(oldDate): string {
    let newDate = new Date(oldDate);
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    return String(newDate);
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
    const month = dummyMonth > 10 ? dummyMonth.toString() : "0" + dummyMonth.toString();
    const day = date.getDate() > 10 ? date.getDate().toString() : "0" + date.getDate().toString();
    return year + "-" + month + "-" + day;
  }

}


