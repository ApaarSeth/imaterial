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
<<<<<<< HEAD
    private commonService: CommonService
=======
    private commonService: CommonService,
>>>>>>> b021db0c87a2f5b12cae2b33a278bc787ee290c0
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
