import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from "@angular/router";
import { GRNService } from 'src/app/shared/services/grn.service';

@Injectable()
export class ViewGrnResolver implements Resolve<any> {
    constructor(private grnService: GRNService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let poId = route.params["poId"]
        let orgId = Number(localStorage.getItem("orgId"));
        return this.grnService.viewGRN(orgId, poId).then(res => res.data);
    }
}
