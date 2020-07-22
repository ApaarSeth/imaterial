import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/userDashboard/user.service';
import { Subscription } from 'rxjs';
import { IBreadCrumb } from '../../models/breadcrumbs';
import { MenuList } from '../../models/menu.model';

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html"
})
export class MainLayoutComponent implements OnInit {
  subscription: Subscription;
  subscriptions: Subscription[] = [];
  userId: number;
  userName: string;
  url: string;
  isSideNavCollapsed: boolean;
  menuData: MenuList;
  subscriptionsData: any;
  isFreeTrialActivate: boolean;

  constructor(private router: Router,
    private _userService: UserService,
    private activateRoute: ActivatedRoute
  ) { }

  loaded = '';
  ngOnInit() {
    this.menuData = this.activateRoute.snapshot.data.menu;
    this.subscriptionsData = this.activateRoute.snapshot.data.subsData;
    this.userId = Number(localStorage.getItem("userId"));
    this.userName = localStorage.getItem("userName");
    this.url = localStorage.getItem('profileUrl');
    this.startSubscriptions();
    this.checkFreeTrial();
  }

  checkFreeTrial() {
    const data = this.subscriptionsData;
    if (data && data.planFrequencyList.length) {
      let checked = 0;
      for (let i = 0; i < data.planFrequencyList.length; i++) {
        for (let x = 0; x < data.planFrequencyList[ i ].planList.length; x++) {
          if (checked == 0) {
            if (data.planFrequencyList[ i ].planList[ x ].isTrialActive === 1) {
              checked = 1;
              this.isFreeTrialActivate = true;
            }
          }
        }
      }
    }
  }


  isLoaded(event) {
    this.loaded = event
  }

  goToProfile(sidenav) {
    this.router.navigate([ '/profile-account' ]).then(_ => {
      sidenav.close();
    });

  }

  startSubscriptions() {
    this.subscriptions.push(
      this._userService.UpdateProfileImage.subscribe(image => {
        this.url = image;
        localStorage.setItem('profileUrl', this.url);
      })
    );
  }



  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  isSidebarCollapsed(e) {
    // this.isSideNavCollapsed = e;
    if (e) {
      localStorage.setItem('sidebarNavigation', e);
    }
    localStorage.setItem('sidebarNavigation', e);
  }
}
