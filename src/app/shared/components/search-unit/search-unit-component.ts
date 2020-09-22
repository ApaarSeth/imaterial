import { SearchUnitConfig } from './../../models/search-unit.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
    selector: 'app-search-unit',
    templateUrl: './search-unit-component.html'
})

export class SearchUnitComponent implements OnInit {

    @Output() getSelectedUnit = new EventEmitter<string>();
    @Input() config: SearchUnitConfig;
    form: FormGroup;

    constructor(
        private fB: FormBuilder
    ) { }

    ngOnInit(): void {
        // this.getSelectedUnit.emit(this.config.selectedUnit);
        this.checkSelectedUnitCase();
        this.formInit();
    }

    checkSelectedUnitCase() {
        if (this.config.selectedUnit) {
            this.config.materialUnits.forEach(item => {
                if (this.config.selectedUnit.toLowerCase() == item.toLowerCase()) {
                    this.config.selectedUnit = item;
                }
            });
        }
    }

    formInit() {
        this.form = this.fB.group({
            materialUnit: [ this.config.selectedUnit ? this.config.selectedUnit : null ]
        })

        this.form.valueChanges.subscribe(val => {
            this.getSelectedUnit.emit(val.materialUnit);
        });
    }

    getUnitsData(data) {
        if (data) {
            return data.split(',');
        } else {
            return [];
        }
    }

    filterUnits(event, inpt) {
        if (event.target.value) {
            inpt.dataset.filterData = this.config.materialUnits.filter(itm => itm.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1);
        } else {
            inpt.dataset.filterData = this.config.materialUnits;
        }
    }

}