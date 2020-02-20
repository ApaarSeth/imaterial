import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { NgModule } from "@angular/core";
import { MatSidenav } from "@angular/material";
import { Router } from "@angular/router";
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class HeaderLayoutComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  @Input("menu") menu: MatSidenav;
  public buttonName: string = "projectStore";
  orgId:Number;
  role: string;
  permissionObj:any
  constructor(private permissionService:PermissionService,private router: Router) {}

  ngOnInit() {
    this.orgId=Number(localStorage.getItem("orgId"))
    this.role=localStorage.getItem("role")
    // this.checkPermission(this.role);
    this.permissionObj=this.permissionService.checkPermission();
  }

  
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
  setButtonName(name: string) {
    this.buttonName = name;
    if (name == "projectStore") {
      this.permissionObj=this.permissionService.checkPermission()
      this.router.navigate(["/"]);
    } else if (name == "globalStore") {
      this.permissionObj=this.permissionService.checkPermission()
      this.router.navigate(["globalStore/",this.orgId]);
    } else if (name === "requestForQuotation") {
      this.permissionObj=this.permissionService.checkPermission()
      this.router.navigate(["rfq/rfq-detail"]);
    } else if (name === "users") {
      this.permissionObj=this.permissionService.checkPermission()
      this.router.navigate(["users/user-detail"]);
    } else if (name === "purchaseOrder") {
      this.permissionObj=this.permissionService.checkPermission()
      this.router.navigate(["po/detail-list"]);
    } else if (name === "supplier") {
      this.permissionObj=this.permissionService.checkPermission()
      this.router.navigate(["supplier/detail"]);
    }
  }
}
