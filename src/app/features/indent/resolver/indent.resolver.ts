import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  ActivatedRoute,
  RouterStateSnapshot
} from "@angular/router";
import { IndentService } from "src/app/shared/services/indent.service";

@Injectable()
export class IndentResolver implements Resolve<any> {
  projectId: number;
  constructor(
    private indentService: IndentService,
    private route: ActivatedRoute //private projectService: ProjectService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.projectId = route.params["id"];
    return this.indentService.getIndentList(this.projectId, {}).then(data => {
      return data.data;
    });
  }
}
