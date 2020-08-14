import { forEachChild } from 'typescript';
import { planList, planFeatureObjList, planLimit } from './../../models/subscriptions';
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
                    "planName": "Custom", "activeSubscription": null, "planSortSeq": 3, "planFeatureList": null, "planFeatureObjList": [ { "featureName": "Customizable", "available": true },
                    { "featureName": "Supplier Management", "available": true },
                    { "featureName": "Bill of Materials (BOM)", "available": true },
                    { "featureName": "Purchase Requisitions", "available": true },
                    { "featureName": "Request for Price (RFP)", "available": true },
                    { "featureName": "Purchase Orders", "available": true },
                    { "featureName": "Receipts", "available": true },
                    { "featureName": "Material Issuance", "available": true },
                    { "featureName": "Payment Records", "available": true },
                    { "featureName": "Inventory Management", "available": true },
                    { "featureName": "PO ShortClose", "available": true },
                    { "featureName": "Comprehensive Dashboards", "available": true },
                    { "featureName": "Real Time Status Tracking", "available": true },
                    { "featureName": "Currency Administration", "available": true },
                    // { "featureName": "Intersite Transfer", "available": true },
                    { "featureName": "Vendor Rating", "available": true },
                    { "featureName": "Image Integration", "available": true },
                    { "featureName": "Reports & Analytics", "available": true },
                    { "featureName": "Aggregated Purchase", "available": true },
                    { "featureName": "On Demand Dedicated Onboarding", "available": true },
                    { "featureName": "Detailed Training Modules", "available": true },
                    { "featureName": "On site Resoursce", "available": true },
                    { "featureName": "And a lot more..", "available": true } ]
                };
                if (subsdata.planFrequencyList && subsdata.planFrequencyList.length) {
                    subsdata.planFrequencyList.forEach(item => {
                        item.planList.push(cstmPlan);
                        item.planList.forEach(itm => {
                            let premiumFeatures = [
                                { "featureName": "Supplier Management", "available": true },
                                { "featureName": "Bill of Materials (BOM)", "available": true },
                                { "featureName": "Purchase Requisitions", "available": true },
                                { "featureName": "Request for Price (RFP)", "available": true },
                                { "featureName": "Purchase Orders", "available": true },
                                { "featureName": "Receipts", "available": true },
                                { "featureName": "Material Issuance", "available": true },
                                { "featureName": "Payment Records", "available": true },
                                { "featureName": "Inventory Management", "available": true },
                                { "featureName": "PO ShortClose", "available": true },
                                { "featureName": "Comprehensive Dashboards", "available": true },
                                { "featureName": "Real Time Status Tracking", "available": true },
                                { "featureName": "Currency Administration", "available": true },
                                // { "featureName": "Intersite Transfer", "available": true },
                                { "featureName": "Vendor Rating", "available": true },
                                { "featureName": "Image Integration", "available": true },
                                { "featureName": "Reports & Analytics", "available": true },
                                { "featureName": "Aggregated Purchase", "available": true },
                                { "featureName": "On Demand Dedicated Onboarding", "available": false } ];
                            let basicFeatures = [
                                { "featureName": "Supplier Management", "available": true },
                                { "featureName": "Bill of Materials (BOM)", "available": true },
                                { "featureName": "Purchase Requisitions", "available": true },
                                { "featureName": "Request for Price (RFP)", "available": true },
                                { "featureName": "Purchase Orders", "available": true },
                                { "featureName": "Receipts", "available": true },
                                { "featureName": "Material Issuance", "available": true },
                                { "featureName": "Payment Records", "available": true },
                                { "featureName": "Inventory Management", "available": true },
                                { "featureName": "PO ShortClose", "available": true },
                                { "featureName": "Comprehensive Dashboards", "available": true },
                                { "featureName": "Real Time Status Tracking", "available": true },
                                { "featureName": "Currency Administration", "available": true },
                                // { "featureName": "Intersite Transfer", "available": false },
                                { "featureName": "Vendor Rating", "available": false },
                                { "featureName": "Image Integration", "available": false },
                                { "featureName": "Reports & Analytics", "available": false },
                                { "featureName": "Aggregated Purchase", "available": false },
                                { "featureName": "On Demand Dedicated Onboarding", "available": false } ];
                            if (itm.planName === 'Basic') {
                                itm.planFeatureObjList = basicFeatures;
                                itm.planFeatureObjList.unshift({ "featureName": itm.planLimit.userCount + " users", "available": true });
                            }
                            if (itm.planName === 'Premium') {
                                itm.planFeatureObjList = premiumFeatures;
                                itm.planFeatureObjList.unshift({ "featureName": itm.planLimit.userCount + " users", "available": true });
                            }
                        });
                    });
                }

                return subsdata;
            });
        }

    }
}