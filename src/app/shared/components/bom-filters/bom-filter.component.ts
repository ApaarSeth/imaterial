import { InputTextSearchCompoent } from './../input-text-search/input-text-search.component';
import { BomService } from './../../services/bom.service';
import { BomFilterConfig } from './../../models/bom.model';
import { Component, Input, Output, EventEmitter } from "@angular/core";


@Component({
    selector: 'bom-filter',
    templateUrl: './bom-filter.component.html'
})

export class BomFilterComponent {

    @Input() config: BomFilterConfig;
    @Output() getBomFilers = new EventEmitter<any>();

    constructor(
        private bomService: BomService
    ) { }

    allData = {};

    getData(obj) {
        this.allData[ obj.type ] = obj.data;
        this.config.options.forEach(item => {
            if (item.dependSearch === obj.id) {
                this.bomService.getTradeCategory({ tradeNames: [ ...this.bomService.getNames(obj.data) ] }).then(res => {
                    item.data = this.bomService.getCategoriesByIDName(res.data);
                });
            }
        })
    }

    getAllData() {
        this.getBomFilers.emit(this.allData);
    }

    clearData() {
        this.bomService.resetBomFilter$.next();
    }

}