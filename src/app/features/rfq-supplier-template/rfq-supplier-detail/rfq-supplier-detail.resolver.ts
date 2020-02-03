import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  ActivatedRoute
} from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";

@Injectable()
export class RFQSupplierDetailResolver implements Resolve<any> {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rfqService: RFQService
  ) {}

  resolve() {
    return this.rfqService
      .getRFQDetailSupplier(
        this.route.snapshot.params["rfqId"],
        this.route.snapshot.params["supplierId"]
      )
      .then(data => {
        console.log("wefrgthyjhgff", data.data);
        return data.data;
      });
  }
}
