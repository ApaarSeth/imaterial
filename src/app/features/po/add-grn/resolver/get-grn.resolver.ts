import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from "@angular/router";
import { GRNService } from 'src/app/shared/services/grn/grn.service';

@Injectable()
export class ViewGrnResolver implements Resolve<any> {
    constructor(private grnService: GRNService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.grnService.viewGRN(1, 9).then(res => res.data);
    }
}
