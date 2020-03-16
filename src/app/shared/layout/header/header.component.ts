import { Component, OnInit, Output, EventEmitter, SimpleChanges } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { PermissionService } from "../../services/permission.service";
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HeaderConstants, ConfigurationConstants } from '../../constants/configuration-constants';
@Component({
  selector: "app-header",
  templateUrl: "./header.html"
})
export class HeaderLayoutComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  public buttonName: string = "dashboard";
  orgId: Number;
  role: string;
  permissionObj: any;
  notifClicked: boolean = false;
  userId: number;
  subsriptions: Subscription[] = [];
  headerConst: { name: string, link: string }[]

  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.role = localStorage.getItem("role");
    this.sidenavToggle.emit('loaded');
    this.permissionObj = this.permissionService.checkPermission();
    this.headerConst = HeaderConstants.PERMISSIONHEADER(this.permissionObj, this.orgId);
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
    if (url.includes('dashboard') && !url.includes('project-dashboard')) {
      this.buttonName = 'Dashboard'
    } else if (url.includes('project-dashboard')) {
      this.buttonName = 'Project Store'
    }
    else if (url.includes('globalStore')) {
      this.buttonName = 'Global Store'
    }
    else if (url.includes('rfq')) {
      this.buttonName = 'Request For Quotation'
    }
    else if (url.includes('Users')) {
      this.buttonName = 'Users'
    }
    else if (url.includes('po')) {
      this.buttonName = 'Purchase Order'
    }
    else if (url.includes('supplier')) {
      this.buttonName = 'Supplier'
    }
  }

  // setButtonName(name: string) {

  //   this.buttonName = name;

  //   if (name == "dashboard") {
  //     this.router.navigate(["dashboard"]);

  //   } else if (name == "projectStore") {
  //     this.permissionObj = this.permissionService.checkPermission();
  //     this.router.navigate(["project-dashboard"]);

  //   } else if (name == "globalStore") {
  //     this.permissionObj = this.permissionService.checkPermission();
  //     this.router.navigate(["globalStore/", this.orgId]);

  //   } else if (name === "requestForQuotation") {
  //     this.permissionObj = this.permissionService.checkPermission();
  //     this.router.navigate(["rfq/rfq-detail"]);

  //   } else if (name === "users") {
  //     this.permissionObj = this.permissionService.checkPermission();
  //     this.router.navigate(["users/user-detail"]);

  //   } else if (name === "purchaseOrder") {
  //     this.permissionObj = this.permissionService.checkPermission();
  //     this.router.navigate(["po/detail-list"]);

  //   } else if (name === "supplier") {
  //     this.permissionObj = this.permissionService.checkPermission();
  //     this.router.navigate(["supplier/detail"]);
  //   }
  // }

  routeTo(route) {
    this.router.navigate([route]);
  }

  closeDialog() {
    this.notifClicked = false;
  }

  ngOnDestroy() {
    this.subsriptions.forEach(subs => subs.unsubscribe());
  }
}