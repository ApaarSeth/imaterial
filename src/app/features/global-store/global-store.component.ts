import { Component, OnInit } from "@angular/core";
import { ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-global-store",
  templateUrl: "./global-store.component.html",
  styleUrls: ["../../../assets/scss/main.scss"]
})
export class GlobalStoreComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log(data.globalData);
    });
  }
}
