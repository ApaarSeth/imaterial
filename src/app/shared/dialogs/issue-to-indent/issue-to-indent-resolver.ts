import { Injectable, Inject } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { BomService } from "../../services/bom/bom.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Injectable()
export class IssueToIndentResolver implements Resolve<any> {
  constructor(
    private bomService: BomService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  resolve() {
    return this.bomService
      .getIssueToIndent(this.data.materialId, this.data.projectId)
      .then(data => {
        return data.data;
      });
  }
}
