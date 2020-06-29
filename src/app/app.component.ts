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
  }
}
