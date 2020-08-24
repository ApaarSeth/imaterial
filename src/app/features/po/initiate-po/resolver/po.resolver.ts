import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ProjectService } from "../../../../shared/services/project.service";
import { CommonService } from "../../../../shared/services/commonService";

@Injectable()
export class InitiatePoResolver implements Resolve<any> {
  constructor(
    private projectService: ProjectService,
    private commonService: CommonService
  ) { }

  resolve() {

    let userId = Number(localStorage.getItem("userId"))
    let orgId = Number(localStorage.getItem("orgId"))

    return Promise.all([
      this.commonService.getSuppliers(orgId),
      this.projectService.getProjects(orgId, userId)
    ]).then(data => {
      return data;
    });
  }
}
