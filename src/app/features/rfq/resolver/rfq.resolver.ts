import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";

@Injectable()
export class RFQResolver implements Resolve<any> {
  constructor(private projectService: ProjectService) {}

  resolve() {
    let orgId=Number(localStorage.getItem("orgId"))
    let userId=Number(localStorage.getItem("userId"))
    return this.projectService.getProjects(orgId,userId).then(data => {
      return data.data;
    });
  }
}
