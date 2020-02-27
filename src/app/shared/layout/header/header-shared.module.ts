import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "src/app/shared/material-modules";
import { CommonModule } from "@angular/common";
import { TopHeaderComponent } from './top-header/top-header.component';
import { HeaderLayoutComponent } from './header.component';
import { SidenavListComponent } from './sidenav-list.component';

@NgModule({
  imports: [MaterialModule, FlexLayoutModule, CommonModule],
  providers: [],
  exports: [HeaderLayoutComponent, SidenavListComponent, TopHeaderComponent],
  declarations: [HeaderLayoutComponent, SidenavListComponent, TopHeaderComponent]
})

export class HeaderSharedModule { }