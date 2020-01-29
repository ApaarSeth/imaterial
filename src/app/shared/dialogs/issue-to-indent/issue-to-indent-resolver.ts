import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { BomService } from '../../services/bom/bom.service';

@Injectable()
export class IssueToIndentResolver implements Resolve<any> {
    constructor(private bomService: BomService) { }

    resolve() {
        return this.bomService.getIssueToIndent(13, 4).then(data => {
            console.log("issue to indent api connected...", data.data);
            return data.data;
        });
    }
}
