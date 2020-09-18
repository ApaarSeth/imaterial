import { CommonService } from './../../services/commonService';
import { InputTextSearchCompoent } from './../input-text-search/input-text-search.component';
import { BomService } from './../../services/bom.service';
import { BomFilterConfig } from './../../models/bom.model';
import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";


@Component({
    selector: 'bom-filter',
    templateUrl: './bom-filter.component.html'
})

export class BomFilterComponent implements OnInit {

    @Input() config: BomFilterConfig;
    @Output() getBomFilers = new EventEmitter<any>();

    constructor(
        private bomService: BomService,
        private commonService: CommonService
    ) { }

    allData = {};
    isMobile: boolean;

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
    }

    getData(obj) {
        this.allData[ obj.type ] = obj.data;
        this.config.options.forEach(item => {
            if (item.dependSearch === obj.id) {
                const tradeList = this.bomService.getNames(obj.data);
                this.bomService.getTradeCategory({ tradeNames: tradeList.length ? [ ...tradeList ] : null }).then(res => {
                    item.data = this.bomService.getCategoriesByIDName(res.data);
                    item.preSelected = this.filterPreselected(this.allData[ item.key ], this.allData[ obj.type ]);
                });
            }
        })
    }

    filterPreselected(data1, data2) {
        let result = [];
        if ((data1 && data1.length) && (data2 && data2.length)) {
            data1.forEach(item => {
                let idMatches = data2.some(itm => {
                    if (itm.tradeId && itm.tradeId === item.tradeId) {
                        return true;
                    }
                })
                if (idMatches) {
                    result.push(item);
                }
            })
        }
        return result;
    }

    getAllData() {
        this.getBomFilers.emit(this.allData);
    }

    clearData() {
        this.bomService.resetBomFilter$.next();
    }

}