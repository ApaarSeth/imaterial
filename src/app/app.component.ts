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
    console.log(/iPad|iPhone|iPod/.test(window.navigator.userAgent.toLowerCase()))
    console.log((window.navigator.userAgent.toLowerCase().indexOf('safari')))
    console.log((window.navigator.userAgent.toLowerCase()))
    if (/iPad|iPhone|iPod/.test(window.navigator.userAgent.toLowerCase())) {
      if (this.swUpdate.isEnabled) {
        this.swUpdate.available.subscribe(() => {

          if (confirm("New version available. Load New Version?")) {

            window.location.reload();
          }
        });
      }

    }

    // this.swPush.notificationClicks.subscribe(({ action, notification }) => {
    //   window.open(notification.data.url)
    // })
    this.visitorsService.getGEOLocation().then(res => {
      // this.loader.show()
      // this.dataService.getRequest(API.COUNTRYCODE, null, { skipLoader: true }).then(res => {
      //   // localStorage.setItem('countryCode', res[0]['calling_code'])
      //   // this.callingCode = res[0]['calling_code']
      //   // this.countryCode = res[0]['country_code2']
      //   // this.countryList = res[1]['data']
      //   this.loader.hide()
      // })
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
