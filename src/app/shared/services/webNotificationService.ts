import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
@Injectable({
  providedIn: 'root',
})
export class WebNotificationService {
  readonly VAPID_PUBLIC_KEY = 'BP5uGBp6nPyVGkY47AwG9RQCyMiNpwsPxZijwRo6Xvt9Yg9iVNnr9IDjJjjN_6p5s8W8pnBe4wlH9KjiFP9PUsg';
  private baseUrl = 'http://localhost:5000/notifications';
  constructor(private http: HttpClient,
    private swPush: SwPush) { }
  subscribeToNotification() {
    if (!this.swPush.isEnabled) {
      console.log('Notification is not enabled')
      return;
    }
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => this.sendToServer(sub))
      .catch(err => console.error('Could not subscribe to notifications', err));
  }
  sendToServer(params: any) {
    console.log(JSON.stringify(params))
    this.http.post(this.baseUrl, { notification: params }).subscribe();
  }
}