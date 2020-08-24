import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { POService } from "src/app/shared/services/po.service";

@Injectable()
export class PODetailListResolver implements Resolve<any> {
  constructor(private poDetailService: POService) { }

  resolve() {
    // let orgId=Number(localStorage.getItem("orgId"))
    return this.poDetailService.getPODetails({}).then(data => {
      return data.data;
    });
  }
}
