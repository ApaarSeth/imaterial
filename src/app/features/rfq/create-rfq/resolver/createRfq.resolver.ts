import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, ActivatedRoute } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { CommonService } from 'src/app/shared/services/commonService';

@Injectable()
export class CreateRfqResolver implements Resolve<any> {
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private commonService: CommonService
  ) { }

  resolve() {
    let userId = Number(localStorage.getItem("userId"));
    let orgId = Number(localStorage.getItem("orgId"));
    let id = this.route.snapshot.params['rfqId']
    return Promise.all([
      this.commonService.getSuppliers(orgId, id ? false : true),
      this.projectService.getProjects(orgId, userId, id ? false : true)
    ]).then(data => {
      return data;
    });
  }
}
