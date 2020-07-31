import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { CommonService } from 'src/app/shared/services/commonService';

@Injectable()
export class GrnResolver implements Resolve<any> {
  constructor(
    private projectService: ProjectService,
    private commonService: CommonService
  ) { }

  resolve() {
    let userId = Number(localStorage.getItem("userId"));
    let orgId = Number(localStorage.getItem("orgId"));
    return this.projectService.getProjects(orgId, userId).then(res => {
      return res.data;
    });
  }
}
