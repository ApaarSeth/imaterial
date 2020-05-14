
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { LayoutModule } from "@angular/cdk/layout";
import { ReportRoutingModule } from "./report-dashboard-routing.module";
import { ReportDetailComponent } from './report-details/report-details.component';

import { MaterialModule } from "../../shared/material-modules";
import { AppSharedModule } from "../../shared/app-shared-module";
import { ReportResolver } from "./resolver/report.resolver";

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
    ReportRoutingModule
  ],
  providers : [ ReportResolver ],
  declarations: [
    ReportDetailComponent
  ]
})

export class ReportDashboardModule { }