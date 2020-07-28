import { Injectable } from "@angular/core";
import { DataService } from './data.service';
import { SubscriptionsPayments } from '../models/subscription-payments';
import { API } from '../constants/configuration-constants';
import { DataServiceOptions } from '../models/data-service-options';
import { Utils } from '../helpers/utils';
import { Router } from '@angular/router';

@Injectable({
    providedIn: "root"
})

export class ReportService {

    constructor(
        private dataService: DataService,
        private _router: Router
    ) { }

    getSupplierLiabilityReport(data) {
        return this.dataService.sendPostRequest(API.SUPPLIERLIABILITYREPORT, data)
    }

}