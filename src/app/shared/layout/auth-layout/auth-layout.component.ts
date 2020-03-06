import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: "app-auth-layout",
  templateUrl: "./auth-layout.component.html"
})
export class AuthLayoutComponent implements OnInit {
  mySubscription: any;

  constructor(private router: Router) {
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };

    // this.mySubscription = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.router.navigated = false;
    //   }
    // });
  }

  ngOnInit() { }
}
