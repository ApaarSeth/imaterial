import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["../assets/scss/main.scss"]
})
export class AppComponent {
  title = "imaterial";
  location: string;
  hideHeader: boolean = false;
    constructor(
      private _activatedRoute : ActivatedRoute
  ) {
  }

  ngOnInit() {
    // console.log(window.location.href);
    this.location = window.location.href;
    if(this.location.includes('rfq-bids/supplier/') || this.location.includes('rfq-bids/after-submit/')){
      this.hideHeader = true;
    }
    else{
        this.hideHeader = false;
    }
  }

}
