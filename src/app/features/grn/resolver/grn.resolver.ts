import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ProjectService } from "../../../shared/services/project.service";
import { CommonService } from "../../../shared/services/commonService";

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
