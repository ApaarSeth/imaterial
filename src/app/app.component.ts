import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookPixelService } from './shared/services/fb-pixel.service';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { WebNotificationService } from './shared/services/webNotificationService.service';
import { Visitor } from '@angular/compiler/src/render3/r3_ast';
import { VisitorService } from './shared/services/visitor.service';
import { API } from './shared/constants/configuration-constants';

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
    private visitorsService: VisitorService,
    private swPush: SwPush,
    private _activatedRoute: ActivatedRoute,
    private fbPixel: FacebookPixelService,
    private webNotificationService: WebNotificationService,
    private swUpdate: SwUpdate
  ) {
  }


  ngOnInit() {
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      window.open(notification.data.url)
    })
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
