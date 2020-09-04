import { BomSearchData, BomFilterItemConfig } from './../../models/bom.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
    selector: 'multi-select-search',
    templateUrl: './multi-select-search.component.html'
})

export class MultiSelectSearchComponent implements OnInit {

    constructor(
        private formBuilder: FormBuilder
    ) { }

    form: FormGroup;

    @Output() selectionUpdate = new EventEmitter<number[]>();
    @Input() config: BomFilterItemConfig;


    filtered: BomSearchData[];
    ngOnInit(): void {
        this.formInit();
    }

    formInit() {
        this.form = this.formBuilder.group({
            searchInput: [ '' ],
            selected: []
        })

        if (this.config.preSelected && this.config.preSelected.length) {
            this.form.get('selected').setValue(this.config.preSelected);
            this.selectionUpdate.emit(this.config.preSelected);
        }

        this.form.get('searchInput').valueChanges.subscribe(val => {
            if (val) {
                this.filtered = this.config.list.filter(itm => itm.name.toLowerCase().indexOf(val.toLowerCase()) !== -1);
            } else {
                this.filtered = null
            }
        })

        this.form.get('selected').valueChanges.subscribe(val => {
            this.selectionUpdate.emit(val);
        })
    }

}