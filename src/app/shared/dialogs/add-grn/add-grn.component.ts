import { Component, OnInit } from '@angular/core';
import { CountryCode } from '../../models/currency';
import { CommonService } from '../../services/commonService';

@Component({
    selector: 'app-add-grn',
    templateUrl: 'add-grn.component.html'
})

export class AddGrnComponent implements OnInit {
    countryList: CountryCode[]
    constructor(private commonService: CommonService) { }

    ngOnInit() {
        this.commonService.getCountry().then(res => {
            this.countryList = res.data;
        })
    }

    selectionChange($event) {

    }
}