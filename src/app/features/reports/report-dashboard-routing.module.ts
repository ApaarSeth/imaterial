import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { ReportDetailComponent } from "./report-details/report-details.component";
import { ReportResolver } from "./resolver/report.resolver";

const routes: Routes = [
  {
    path: "",
    resolve: { ReportResolver: ReportResolver },
    component: ReportDetailComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})

export class ReportRoutingModule { }