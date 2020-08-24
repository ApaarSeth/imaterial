
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { LayoutModule } from "@angular/cdk/layout";

import { MaterialModule } from "../../shared/material-modules";
import { AppSharedModule } from "../../shared/app-shared-module";
import { SupplierLiabilityReportResolver } from "./resolver/supplier-liability-report.resolver";
import { SupplierLiabilityReportDetailComponent } from "./supplier-liability-report-details/supplier-liability-report-details.component";
import { ReportRoutingModule } from './report-dashboard-routing.module';
import { CTCReportComponent } from './ctc-report/ctc-report.component';
import { SelectCheckAllComponent } from './select-check-all/select-check-all.component';

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
  providers: [SupplierLiabilityReportResolver],
  declarations: [
    SupplierLiabilityReportDetailComponent,
    CTCReportComponent,
    SelectCheckAllComponent
  ]
})

export class ReportDashboardModule { }