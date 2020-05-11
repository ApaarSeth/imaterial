import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { BomService } from "src/app/shared/services/bom/bom.service";

@Injectable()
export class BomResolver implements Resolve<any> {
  constructor(private bomService: BomService) {}

  resolve() {
    return this.bomService.getCategory().then(data => {
      return data;
    });
  }
}
