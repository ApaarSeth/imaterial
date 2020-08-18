import { Injectable } from "@angular/core";
import {
  Resolve,
  Router,
  ActivatedRoute
} from "@angular/router";
import { RFQService } from "../../../shared/services/rfq.service";

@Injectable()

export class RFQSupplierDetailResolver implements Resolve<any> {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rfqService: RFQService
  ) { }

  resolve() {
    return this.rfqService
      .getRFQDetailSupplier(
        this.route.snapshot.params["rfqId"],
        this.route.snapshot.params["supplierId"]
      )
      .then(data => {
        return data.data;
      });
  }
}
