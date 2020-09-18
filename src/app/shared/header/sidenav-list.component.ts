import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { HeaderConstants } from '../constants/configuration-constants';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AppNavigationService } from '../services/navigation.service';
import { MenuList } from '../models/menu.model';
import { CommonService } from '../services/commonService';
@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.html'
})
export class SidenavListComponent implements OnInit {

  role: string;
  permissionObj: any;
  notifClicked: boolean = false;
  userId: number;
  headerConst: { name: string, link: string }[]
  @Output() sidenavClose = new EventEmitter();
  @Input() sidenav: any;
  orgId: number;
  subsriptions: Subscription[] = [];
  buttonName: string;

  accountOwner: any;

  isPlanAvailable: any;

  @Input('menuData') data: MenuList;

  constructor(
    private permissionService: PermissionService,
    private navService: AppNavigationService,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.role = localStorage.getItem("role");

    this.isPlanAvailable = Number(localStorage.getItem('isPlanAvailable'));
    this.accountOwner = Number(localStorage.getItem('accountOwner'));

    if (this.data.moduleList && this.data.moduleList.length) {
      this.data.moduleList.forEach(itm => {
        if (itm.modulePath === 'globalStore/') {
          itm.modulePath = itm.modulePath + this.orgId;
        }
      });
    }

    if (this.role) {
      this.permissionObj = this.permissionService.checkPermission(this.role);
      this.headerConst = HeaderConstants.PERMISSIONHEADER(this.permissionObj, this.orgId);
    }
    this.highlightButton(this.router.url);
    this.startSubscription();
  }

  startSubscription(): void {

    this.subsriptions.push(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(event => {
          this.highlightButton(this.router.url);
        })
    )
  }

  highlightButton(url: string) {
    if (url) {
      this.buttonName = url.substring(1);

      if (url.includes('globalStore')) {
        this.navService.gaEvent({
          action: 'submit',
          category: 'global_store',
          label: null,
          value: null
        });
      }

    }
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
  redirect(path) {
    this.router.navigate([ path ]).then(_ => {
      this.sidenav.close();
    })
  }

  goToMyPlans() {
    this.router.navigate([ '/subscriptions' ]);
    this.buttonName = 'My Plans';
    this.sidenav.close();
  }

  logout() {
    this.router.navigate([ '/auth/login' ]).then(_ => {
      localStorage.clear();
    });
  }

  ngOnDestroy() {
    this.subsriptions.forEach(subs => subs.unsubscribe());
  }
}