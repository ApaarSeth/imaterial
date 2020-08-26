import { BomService } from 'src/app/shared/services/bom.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Resolve } from '@angular/router';


@Injectable()

export class EditBomMaterialResolver implements Resolve<any> {

    constructor(
        private bomService: BomService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        const id = Number(route.params.id);
        const orgId = Number(localStorage.getItem('orgId'));
        return this.bomService.getMaterialWithQuantity(orgId, id).then(res => res.data);
    }

}