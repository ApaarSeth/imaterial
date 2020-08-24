import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { GlobalStoreService } from "src/app/shared/services/global-store.service";

@Injectable()
export class GlobalStoreResolver implements Resolve<any> {
  constructor(private globalStoreService: GlobalStoreService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    let orgId = Number(localStorage.getItem("orgId"));

    return this.globalStoreService.getMaterialWiseData(orgId).then(res => {
      return res;
    })

    // return Promise.all([
    //   this.globalStoreService.getMaterialWiseData(orgId),
    //   this.globalStoreService.getProjectWiseData(orgId)
    // ]).then(res => res);

  }
}
