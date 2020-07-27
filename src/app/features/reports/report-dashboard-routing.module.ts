import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { SupplierLiabilityReportDetailComponent } from "./supplier-liability-report-details/supplier-liability-report-details.component";
import { SupplierLiabilityReportResolver } from "./resolver/supplier-liability-report.resolver";

const routes: Routes = [
  {
    path: "supplier-liability",
    data: { breadcrumb: 'Supplier-Liability' },
    resolve: { resolverData: SupplierLiabilityReportResolver },
    component: SupplierLiabilityReportDetailComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})

export class ReportRoutingModule { }