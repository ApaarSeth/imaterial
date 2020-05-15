import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";

@Injectable()
export class SupplierLiabilityReportResolver implements Resolve<any> {
  constructor(
    private projectService: ProjectService,
    private rfqService: RFQService
  ) {}

  resolve() {
    let userId = Number(localStorage.getItem("userId"));
    let orgId = Number(localStorage.getItem("orgId"));

    return Promise.all([
      this.rfqService.getSuppliers(orgId),
      this.projectService.getProjects(orgId, userId)
    ]).then(data => {
      return data;
    });
  }
}
