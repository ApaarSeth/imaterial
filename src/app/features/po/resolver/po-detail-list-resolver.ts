import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { PODetailService } from "src/app/shared/services/po-detail/po-detail.service";

@Injectable()
export class PODetailListResolver implements Resolve<any> {
  constructor(private poDetailService: PODetailService) {}

  resolve() {
    return this.poDetailService.getPODetails(1).then(data => {
      console.log("wefrgthyjhgff", data.data);
      return data.data;
    });
  }
}
