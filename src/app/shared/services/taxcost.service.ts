import { Injectable } from '@angular/core';

import { API } from '../constants/configuration-constants';
import { DataService } from './data.service';



@Injectable()
export class TaxCostService {

    constructor(
        private dataService: DataService
    ) { }

    postTaxCostData(data) {
        return this.dataService.sendPostRequest(API.POSTTAXANDOTHERCOST, data);
    }

    poTaxCostData(data) {
        return this.dataService.sendPostRequest(API.POTAXANDOTHERCOST, data);
    }

}