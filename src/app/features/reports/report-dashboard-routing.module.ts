import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { SupplierLiabilityReportDetailComponent } from "./supplier-liability-report-details/supplier-liability-report-details.component";
import { SupplierLiabilityReportResolver } from "./resolver/supplier-liability-report.resolver";
import { CTCReportComponent } from './ctc-report/ctc-report.component';

const routes: Routes = [
  {
    path: "supplier-liability",
    data: { breadcrumb: 'Supplier-Liability' },
    resolve: { resolverData: SupplierLiabilityReportResolver },
    component: SupplierLiabilityReportDetailComponent
  },

  {
    path: "ctc-report",
    data: { breadcrumb: 'CTC-Report' },
    resolve: { resolverData: SupplierLiabilityReportResolver },
    component: CTCReportComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})

export class ReportRoutingModule { }