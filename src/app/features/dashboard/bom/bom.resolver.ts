import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { BomService } from "../../../shared/services/bom.service";

@Injectable()
export class BomResolver implements Resolve<any> {
  constructor(private bomService: BomService) { }

  resolve() {
    return this.bomService.getCategory().then(data => {
      return data;
    });
  }
}
