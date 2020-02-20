import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { NgModule } from "@angular/core";
import { MatSidenav } from "@angular/material";
import { Router } from "@angular/router";

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
  constructor(private router: Router) {}

  ngOnInit() {
    this.orgId=Number(localStorage.getItem("orgId"))
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
  setButtonName(name: string) {
    this.buttonName = name;
    if (name == "projectStore") {
      this.router.navigate(["/"]);
    } else if (name == "globalStore") {
      this.router.navigate(["globalStore/",this.orgId]);
    } else if (name === "requestForQuotation") {
      this.router.navigate(["rfq/rfq-detail"]);
    } else if (name === "users") {
      this.router.navigate(["users/user-detail"]);
    } else if (name === "purchaseOrder") {
      this.router.navigate(["po/detail-list"]);
    } else if (name === "supplier") {
      this.router.navigate(["supplier/detail"]);
    }
  }

  logout(){
    this.router.navigate(['/auth/login']).then(_ => {
      localStorage.clear();
    });
  }
}
