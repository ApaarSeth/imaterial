import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";

@Injectable()
export class RFQSuppliersResolver implements Resolve<any> {
  constructor(private rfqService: RFQService) {}

  resolve() {
    let orgId= Number(localStorage.getItem('orgId'))
    return this.rfqService.getSuppliers(orgId).then(data => {
      return data.data;
    });
  }
}
