import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from '../services/commonService';

@Injectable()
export class MenuResolver implements Resolve<any> {

    constructor(
        private commonService: CommonService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.commonService.getMenuData().then(res => res.data);
    }

}