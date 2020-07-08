import { Injectable } from "@angular/core";
import { DataService } from './data.service';
import { SubscriptionsPayments } from '../models/subscription-payments';
import { API } from '../constants/configuration-constants';
import { DataServiceOptions } from '../models/data-service-options';
import { Utils } from '../helpers/utils';

@Injectable({
    providedIn: "root"
})

export class SubscriptionPaymentsService {
    constructor(
        private dataService: DataService
    ) { }

    postSubscriptionPaymentInitiate(data) {
        return this.dataService.sendPostRequest(API.POST_SUBSRIPTIONINITIATE, data);
    }
}