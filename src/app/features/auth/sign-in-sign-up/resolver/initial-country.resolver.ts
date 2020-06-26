import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from 'src/app/shared/services/commonService';
import { DataService } from 'src/app/shared/services/data.service';
import { API } from 'src/app/shared/constants/configuration-constants';

@Injectable()
export class InitialCountryResolver implements Resolve<any>{

    constructor(
        private dataService: DataService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.dataService.getRequest(API.COUNTRYCODE, null, { skipLoader: true }).then(res => res.data);
    }
}