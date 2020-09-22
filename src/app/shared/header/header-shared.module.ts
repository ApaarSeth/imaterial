import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { TopHeaderComponent } from './top-header/top-header.component';
import { HeaderLayoutComponent } from './header.component';
import { SidenavListComponent } from './sidenav-list.component';
import { SidebarNavigationComponent } from './sidebar-navigation.component';
import { RouterModule } from '@angular/router';
import { AppSharedModule } from '../app-shared-module';
import { MaterialModule } from "../material-modules";

@NgModule({
  imports: [
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
    RouterModule,
    AppSharedModule
  ],
  providers: [],
  exports: [
    HeaderLayoutComponent,
    SidenavListComponent,
    TopHeaderComponent,
    SidebarNavigationComponent
  ],
  declarations: [
    HeaderLayoutComponent,
    SidenavListComponent,
    TopHeaderComponent,
    SidebarNavigationComponent
  ]
})

export class HeaderSharedModule { }