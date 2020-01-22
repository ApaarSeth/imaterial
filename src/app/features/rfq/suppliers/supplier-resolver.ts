import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";

@Injectable()
export class RFQSuppliersResolver implements Resolve<any> {
  constructor(private rfqService: RFQService) {}

  resolve() {
    return this.rfqService.getSuppliers(1).then(data => {
      console.log("wefrgthyjhgff", data.data);
      return data.data;
    });
  }
}
