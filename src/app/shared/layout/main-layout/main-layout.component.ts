import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html"
})
export class MainLayoutComponent implements OnInit {
  mySubscription: any;

  constructor(private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  loaded = '';
  ngOnInit() { }


  isLoaded(event) {
    this.loaded = event
  }


  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
