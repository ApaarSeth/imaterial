import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { BomService } from "src/app/shared/services/bom/bom.service";
import { GlobalStoreService } from "src/app/shared/services/global-store/global-store.service";

@Injectable()
export class GlobalStoreResolver implements Resolve<any> {
  constructor(private globalStoreService: GlobalStoreService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let orgId=Number(localStorage.getItem("orgId"))
    return Promise.all([
      this.globalStoreService.getMaterialWiseData(orgId),
      this.globalStoreService.getProjectWiseData(orgId)
    ]).then(res => res);
  }
}
