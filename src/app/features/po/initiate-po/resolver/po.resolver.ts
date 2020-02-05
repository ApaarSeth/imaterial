import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";

@Injectable()
export class InitiatePoResolver implements Resolve<any> {
  constructor(
    private projectService: ProjectService,
    private rfqService: RFQService
  ) {}

  resolve() {
    return Promise.all([
      this.rfqService.getSuppliers(1),
      this.projectService.getProjects(1, 1)
    ]).then(data => {
      console.log("wefrgthyjhgff", data);
      return data;
    });
  }
}
