import { NgModule } from "@angular/core";
import { HeaderLayoutComponent } from "./header/header.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "src/app/shared/material-modules";
import { CommonModule } from "@angular/common";
import { SidenavListComponent } from "./header/sidenav-list.component";
import { AuthLayoutComponent } from "./auth-layout/auth-layout.component";

@NgModule({
  imports: [MaterialModule, FlexLayoutModule, CommonModule],
  providers: [],
  exports: [] , // [HeaderLayoutComponent, SidenavListComponent],
  declarations: [] // [HeaderLayoutComponent, SidenavListComponent]
})
export class LayoutModule {}
