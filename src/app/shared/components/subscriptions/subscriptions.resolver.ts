import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from '../../services/commonService';

@Injectable()

export class SubscriptionsResolver implements Resolve<any>{

    constructor(
        private commonService: CommonService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.commonService.getSubscriptionPlan().then(res => res.data);
    }
}