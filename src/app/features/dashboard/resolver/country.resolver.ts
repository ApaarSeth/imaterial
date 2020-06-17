import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from 'src/app/shared/services/commonService';

@Injectable()
export class CountryResolver implements Resolve<any>{

    constructor(
        private commonService: CommonService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.commonService.getCountry().then(res => res.data);
    }
}