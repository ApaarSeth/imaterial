import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { NgModule } from "@angular/core";
import { MatSidenav } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class HeaderLayoutModule implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  @Input("menu") menu: MatSidenav;
  public buttonName: string = "projectStore";

  constructor(private router: Router) {}

  ngOnInit() {}

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
  setButtonName(name: string) {
    this.buttonName = name;
    if (name == "projectStore") {
      this.router.navigate(["/"]);
    } else if (name == "globalStore") {
      this.router.navigate(["globalStore/1"]);
    }
  }
}
