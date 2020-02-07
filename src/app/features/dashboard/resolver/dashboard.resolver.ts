import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";

@Injectable()
export class DashBoardResolver implements Resolve<any> {
  constructor(private projectService: ProjectService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let userId=Number(localStorage.getItem("userId"))
    let orgId=Number(localStorage.getItem("orgId"))
    return this.projectService.getProjects(orgId,userId).then(data => {
      console.log("wefrgthyjhgff", data.data);
      return data.data;
    });
  }
}
