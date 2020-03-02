import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { PermissionService } from "../../services/permission.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class HeaderLayoutComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  public buttonName: string = "dashboard";
  orgId: Number;
  role: string;
  permissionObj: any;
  notifClicked: boolean = false;
  userId: number;

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
  }

  setButtonName(name: string) {

    this.buttonName = name;

    if (name == "dashboard") {
      this.router.navigate(["dashboard"]);

    } else if (name == "projectStore") {
      this.permissionObj = this.permissionService.checkPermission();
      this.router.navigate(["project-dashboard"]);

    } else if (name == "globalStore") {
      this.permissionObj = this.permissionService.checkPermission();
      this.router.navigate(["globalStore/", this.orgId]);

    } else if (name === "requestForQuotation") {
      this.permissionObj = this.permissionService.checkPermission();
      this.router.navigate(["rfq/rfq-detail"]);

    } else if (name === "users") {
      this.permissionObj = this.permissionService.checkPermission();
      this.router.navigate(["users/user-detail"]);

    } else if (name === "purchaseOrder") {
      this.permissionObj = this.permissionService.checkPermission();
      this.router.navigate(["po/detail-list"]);

    } else if (name === "supplier") {
      this.permissionObj = this.permissionService.checkPermission();
      this.router.navigate(["supplier/detail"]);
    }
  }

  routeTo(route) {
    this.router.navigate([route]);
  }
  
  closeDialog() {
    this.notifClicked = false;
  }
}