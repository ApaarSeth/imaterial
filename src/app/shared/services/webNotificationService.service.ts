import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { CommonService } from './commonService';
@Injectable({
  providedIn: 'root',
})
export class WebNotificationService {
  private readonly VAPID_PUBLIC_KEY = 'BHuAWT9DqL9ZCn35t_nbGNg1h-kUH2MahmlaHbzEeDlvE5tqyBMCL-GjvkPaud_D-IsRksYsXKdR86ty4EB7sqw';
  // private baseUrl = 'http://localhost:5000/notifications';
  constructor(private http: HttpClient,
    private swPush: SwPush, private commonService: CommonService) { }
  subscribeToNotification() {
    if (!this.swPush.isEnabled) {
      // console.log('Notification is not enabled')
      return;
    }
    // subscribeNotification() {
    //   this.webNotificationService.subscribeToNotification()
    //   if (this.swUpdate.isEnabled) {
    //     this.swUpdate.available.subscribe(() => {
    //       if (confirm("New version available. Load New Version?")) {
    //         window.location.reload();
    //       }
    //     });
    //   }
    //   this.swPush.notificationClicks.subscribe(({ action, notification }) => {
    //     window.open(notification.data.url)
    //   })
    // }
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => this.sendToServer(sub))
      .catch(err => console.error('Could not subscribe to notifications', err));
  }
  sendToServer(params: any) {
    this.commonService.pushNotificationData(params)
  }
}