import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";

@Injectable()
export class RFQSupplierDetailResolver implements Resolve<any> {
  constructor(private router: Router, private rfqService: RFQService) {}

  resolve() {
    return this.rfqService.getRFQDetailSupplier(20, 2).then(data => {
      console.log("wefrgthyjhgff", data.data);
      return data.data;
    });
  }
}
