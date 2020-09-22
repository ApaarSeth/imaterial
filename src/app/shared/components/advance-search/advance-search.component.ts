import { FormGroup } from '@angular/forms';
import { AdvSearchData, AdvSearchConfig } from './../../models/adv-search.model';
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { AdvanceSearchService } from '../../services/advance-search.service';

@Component({
    selector: 'advance-search',
    templateUrl: './advance-search.component.html'
})

export class AdvanceSearchComponent implements OnInit {

    dataToSubmit = {};
    @Input('filterType') filterType: string;

    @Input() config: AdvSearchConfig;
    @Output() submitSearch = new EventEmitter();
    @Output() submitExport = new EventEmitter();
    form: FormGroup;
    constructor(
        private advSearchService: AdvanceSearchService
    ) { }

    ngOnInit(): void {
        this.dataToSubmit = {};
    }

    advSelectionUpdate(list: AdvSearchData[], key: any, isArrVal: string) {
        if (list) {
            switch (isArrVal) {
                case '1':
                    this.dataToSubmit[ key ] = list.map(itm => itm.toString())
                    break;
                case '2':
                    for (let i in key) {
                        this.dataToSubmit[ key[ i ] ] = list[ i ] ? this.advSearchService.getDateInFormat(list[ i ]) : null
                    }
                    break;
                case '3':
                    for (let i in key) {
                        this.dataToSubmit[ key[ i ] ] = list[ i ] ? list[ i ] : null
                    }
                    break;
                default:
                    this.dataToSubmit[ key ] = list.map(itm => itm.id.toString());
            }
        }
    }

    export() {
        this.submitExport.emit(this.dataToSubmit);
    }

    submit() {
        this.submitSearch.emit(this.dataToSubmit);
    }

    clearFilter() {
        this.advSearchService.clearFilter$.next(true);
        this.submitSearch.emit(this.dataToSubmit = {});
    }

}