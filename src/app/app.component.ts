import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookPixelService } from './shared/services/fb-pixel.service';
import { environment } from 'src/environments/environment';
import { API, Froala } from './shared/constants/configuration-constants';
import { VisitorService } from './shared/services/visitor.service';

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
    private _activatedRoute: ActivatedRoute,
    private fbPixel: FacebookPixelService
  ) {
  }

  ngOnInit() {
    this.location = window.location.href;
    this.fbPixel.load();
    if (this.location.includes('rfq-bids/supplier/') || this.location.includes('rfq-bids/after-submit/')) {
      this.hideHeader = true;
    }
    else {
      this.hideHeader = false;
    }
    this.getLocation()
  }

  getLocation() {
    this.visitorsService.getIpAddress().subscribe(res => {
      this.ipaddress = res['ip'];
      this.visitorsService.getGEOLocation(this.ipaddress).subscribe(res => {

        // this.latitude = res['latitude'];
        // this.longitude = res['longitude'];
        // this.currency = res['currency']['code'];
        // this.currencysymbol = res['currency']['symbol'];
        // this.city = res['city'];
        // this.country = res['country_code3'];
        // this.isp = res['isp'];
        console.log(res['country_code3']);
      });
      //console.log(res);

    });
  }
}
