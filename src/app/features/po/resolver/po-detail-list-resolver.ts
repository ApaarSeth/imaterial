import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { POService } from "src/app/shared/services/po/po.service";

@Injectable()
export class PODetailListResolver implements Resolve<any> {
  constructor(private poDetailService: POService) {}

  resolve() {
    return this.poDetailService.getPODetails(1).then(data => {
      console.log("wefrgthyjhgff", data.data);
      return data.data;
    });
  }
}
