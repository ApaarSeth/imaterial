import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";

@Injectable()
export class UserDetailsResolver implements Resolve<any> {
  constructor(private router: Router, private projectService: ProjectService) {}

  resolve() {
    // if (!history.state.checkedMaterials) {
    //   this.router.navigate(["/rfq/project-materials"]);
    // } else {
    //   this.router.navigate(["/rfq/quantity-makes"]);
    // }
    //   return this.projectService.getProjects(1, 1).then(data => {
    //     console.log("wefrgthyjhgff", data.data);
    //     return data.data;
    //   });
    // }
  }
}
