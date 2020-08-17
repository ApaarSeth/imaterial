
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { UserDetailComponent } from './user-details/user-details.component';
import { UserRoutingModule } from './user-dashboard-routing.module';
import { MaterialModule } from "../../shared/material-modules";
import { LayoutModule } from "@angular/cdk/layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppSharedModule } from "../../shared/app-shared-module";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    AppSharedModule,
    UserRoutingModule
  ],
  declarations: [
    UserDetailComponent,

    // AddUserComponent
  ]
})

export class UserDashboardModule { }