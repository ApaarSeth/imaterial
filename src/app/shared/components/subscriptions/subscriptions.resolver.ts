import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from '../../services/commonService';

@Injectable()

export class SubscriptionsResolver implements Resolve<any>{

    constructor(
        private commonService: CommonService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let planCheck = Number(localStorage.getItem('isPlanAvailable'))
        if (planCheck) {
            return this.commonService.getSubscriptionPlan().then(res => {
                let subsdata = res.data;
                let cstmPlan = {
                    "planName": "Custom", "activeSubscription": null, "planSortSeq": 3, "planFeatureList": null, "planFeatureObjList": [{ "featureName": "Customizable", "available": true },
                    { "featureName": "Supplier Management", "available": true },
                    { "featureName": "Bill of Materials(BOM)", "available": true },
                    { "featureName": "Purchase Requisitions", "available": true },
                    { "featureName": "Request for Price(RFP)", "available": true },
                    { "featureName": "Purchase Orders", "available": true },
                    { "featureName": "Good Receipt Notes(GRN)", "available": true },
                    { "featureName": "Material Issuance", "available": true },
                    { "featureName": "Payment Record", "available": true },
                    { "featureName": "Inventory Records", "available": true },
                    { "featureName": "PO ShortClose", "available": true },
                    { "featureName": "Comprehensive Dashboards", "available": true },
                    { "featureName": "Real Time Status Tracking", "available": true },
                    { "featureName": "Currency Administration", "available": true },
                    { "featureName": "Intersite Transfer", "available": true },
                    { "featureName": "Vendor Rating", "available": true },
                    { "featureName": "Image Integration", "available": true },
                    { "featureName": "Reports & Analytics", "available": true },
                    { "featureName": "Aggregated Purchase", "available": true },
                    { "featureName": "On Demand Dedicated Onboarding", "available": true },
                    { "featureName": "And a lot more..", "available": true }]
                };
                subsdata.planFrequencyList.forEach(item => {
                    item.planList.push(cstmPlan);
                });
                return subsdata;
            });
        }

    }
}