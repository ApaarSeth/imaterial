import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { ProjectItemComponent } from "src/app/shared/components/project-item/project-item.component";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { IndentDashboardComponent } from "./indent-dashboard.component";
import { IndentRoutingModule } from "./indent-dashboard-routing.module";
import { IndentDetailComponent } from './indent-detail/indent-detail.component';

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
    IndentRoutingModule
  ],
  providers: [],
  declarations: [
    IndentDashboardComponent,
    AppSharedModule,
    ProjectItemComponent,
    IndentDetailComponent
  ]
})
export class IndentDashboardModule {}
