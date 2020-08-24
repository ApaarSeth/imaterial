import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ProjectService } from "../../../shared/services/project.service";

@Injectable()
export class RFQResolver implements Resolve<any> {
  constructor(private projectService: ProjectService) { }

  resolve() {
    let orgId = Number(localStorage.getItem("orgId"))
    let userId = Number(localStorage.getItem("userId"))
    return this.projectService.getProjects(orgId, userId).then(data => {
      return data.data;
    });
  }
}
