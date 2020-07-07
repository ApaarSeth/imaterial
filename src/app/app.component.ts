import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookPixelService } from './shared/services/fb-pixel.service';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { WebNotificationService } from './shared/services/webNotificationService.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["../assets/scss/main.scss"]
})
export class AppComponent {
  title = "imaterial";
  location: string;
  hideHeader: boolean = false;
  ipaddress: number;
  constructor(
    private swPush: SwPush,
    private _activatedRoute: ActivatedRoute,
    private fbPixel: FacebookPixelService,
    private webNotificationService: WebNotificationService,
    private swUpdate: SwUpdate
  ) {
  }

  ngOnInit() {
    // this.webNotificationService.subscribeToNotification()
    // if (this.swUpdate.isEnabled) {
    //   this.swUpdate.available.subscribe(() => {

    //     if (confirm("New version available. Load New Version?")) {

    //       window.location.reload();
    //     }
    //   });
    // }

    // this.swPush.notificationClicks.subscribe(({ action, notification }) => {
    //   window.open(notification.data.url)
    // })

    this.location = window.location.href;
    this.fbPixel.load();
    if (this.location.includes('rfq-bids/supplier/') || this.location.includes('rfq-bids/after-submit/')) {
      this.hideHeader = true;
    }
    else {
      this.hideHeader = false;
    }
  }
}
