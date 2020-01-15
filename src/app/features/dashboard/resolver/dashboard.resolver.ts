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
    return this.projectService.getProjects(1, 1).then(data => {
      console.log("wefrgthyjhgff", data.data);
      return data.data;
    });
  }
}
