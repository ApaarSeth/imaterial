import { BomFilterItemConfig } from './../../models/bom.model';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'input-text-search',
    templateUrl: './input-text-search.component.html'
})

export class InputTextSearchCompoent implements OnInit {

    form: FormGroup

    constructor(
        private formBuilder: FormBuilder
    ) { }

    @Output() selectionUpdate = new EventEmitter<string>();
    @Input() config: BomFilterItemConfig;

    isOpen: boolean;

    ngOnInit(): void {
        this.formInit();
    }

    formInit() {
        this.form = this.formBuilder.group({
            searchInput: [ '' ]
        })

        this.form.valueChanges.subscribe(val => {
            this.selectionUpdate.emit(val.searchInput);
        })
    }
}
