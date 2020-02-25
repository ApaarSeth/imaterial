import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { MatSidenav } from "@angular/material";
import { Router } from "@angular/router";
import { PermissionService } from "../../services/permission.service";
import { UserService } from '../../services/userDashboard/user.service';
import { NotificationInt } from '../../models/notification';
@Component({
  selector: "app-header",
  templateUrl: "./header.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class HeaderLayoutComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  @Input("menu") menu: MatSidenav;
  public buttonName: string = "projectStore";
  orgId: Number;
  role: string;
  permissionObj: any;
  notifClicked: boolean = false;
  userId: number;
  notificationObj: NotificationInt[] = [];
  readnotification: NotificationInt[] = [];
  unreadnotification: NotificationInt[] = [];
  unreadnotificationLength: number;
  allnotificationLength: number;
  constructor(
    private userService: UserService,
    private permissionService: PermissionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.role = localStorage.getItem("role");
    // this.checkPermission(this.role);
    this.permissionObj = this.permissionService.checkPermission();
    this.userService.getNotification(this.userId).then(res => {
      this.notificationObj = res.data;
      if (this.notificationObj) {
        this.notificationObj.forEach(element => {
          if (element.read == 0) {
            this.unreadnotification.push(element);
          }
          else if (element.read == 1) {
            this.readnotification.push(element);
          }
        })

        if (this.unreadnotification)
          this.unreadnotificationLength = this.unreadnotification.length;

        if (this.readnotification && this.unreadnotification)
          this.allnotificationLength = this.readnotification.length + this.unreadnotification.length;
      }
    })
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };

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

  logout() {
    this.router.navigate(['/auth/login']).then(_ => {
      localStorage.clear();
    });
  }

  openDiv() {
    if (this.notifClicked == true) {
      this.notifClicked = false
    } else {
      this.notifClicked = true;
    }
  }

  routeTo(route) {
    this.router.navigate([route]);
    //  this.router.navigate([""]);
  }

  closeDialog() {
    this.notifClicked = false;
  }
}