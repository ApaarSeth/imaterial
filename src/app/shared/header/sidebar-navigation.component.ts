import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { PermissionService } from "../services/permission.service";
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HeaderConstants } from '../constants/configuration-constants';
import { FacebookPixelService } from '../services/fb-pixel.service';
import { AppNavigationService } from '../services/navigation.service';
import { TokenService } from '../services/token.service';
import { MenuList } from '../models/menu.model';
import { CommonService } from '../services/commonService';
import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: "sidebar-navigation",
  templateUrl: "./sidebar-navigation.component.html"
})

export class SidebarNavigationComponent implements OnInit {
  showFiller = false;
  @Output() public sidenavToggle = new EventEmitter();
  public buttonName: string = "dashboard";
  orgId: Number;
  role: string;
  permissionObj: any;
  notifClicked: boolean = false;
  userId: number;
  @Input('menu') menu: MatSidenav;
  subsriptions: Subscription[] = [];
  headerConst: { name: string, link: string, flag: boolean }[];
  isCollapseMenu: boolean = true;
  @Output('collapseMenu') sideNavCollapse = new EventEmitter<boolean>();

  @Input('menuData') data: MenuList;

  clicked: boolean;


  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private fbPixel: FacebookPixelService,
    private navService: AppNavigationService,
    private tokenService: TokenService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.role = this.tokenService.getRole();
    this.sidenavToggle.emit('loaded');

    if (this.data.moduleList && this.data.moduleList.length) {
      this.data.moduleList.forEach(itm => {
        if (itm.modulePath === 'globalStore/') {
          itm.modulePath = itm.modulePath + this.orgId;
        }
      });
    }

    if (this.role) {
      // this.tokenService.headerRole.subscribe(role => {
      this.permissionObj = this.permissionService.checkPermission(this.role);
      this.headerConst = HeaderConstants.PERMISSIONHEADER(this.permissionObj, this.orgId);
      // })

    }

    this.highlightButton(this.router.url);
    this.startSubscription();
  }

  openMenu() {
    this.menu.open();
  }
  startSubscription(): void {

    this.subsriptions.push(
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(event => {
          this.highlightButton(this.router.url);
          if (event instanceof NavigationEnd) {
            this.fbPixel.fire('PageView');
          }
        })
    )
  }

  showOnHover() {
    if (!this.clicked) {
      this.isCollapseMenu = false;
    }
  }

  hideOnHover() {
    if (!this.clicked) {
      this.isCollapseMenu = true;
    }
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };

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

  routeTo(route) {
    this.router.navigate([ route ]);
  }

  closeDialog() {
    this.notifClicked = false;
  }

  ngOnDestroy() {
    this.subsriptions.forEach(subs => subs.unsubscribe());
  }

  collapseSideMenu() {
    this.isCollapseMenu = !this.isCollapseMenu;
    this.sideNavCollapse.emit(this.isCollapseMenu);
    this.clicked = !this.clicked;
  }
}