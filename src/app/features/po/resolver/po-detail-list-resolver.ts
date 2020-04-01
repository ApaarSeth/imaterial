import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { POService } from "src/app/shared/services/po/po.service";

@Injectable()
export class PODetailListResolver implements Resolve<any> {
  constructor(private poDetailService: POService) {}

  resolve() {
    let orgId=Number(localStorage.getItem("orgId"))
    return this.poDetailService.getPODetails(orgId).then(data => {
      // console.log("wefrgthyjhgff", data.data);
      return data.data;
    });
  }
}
