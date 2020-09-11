import { BomService } from 'src/app/shared/services/bom.service';
import { Subscription } from 'rxjs';
import { BomSearchData, BomFilterItemConfig } from './../../models/bom.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, OnChanges, SimpleChanges } from "@angular/core";

@Component({
    selector: 'multi-select-search',
    templateUrl: './multi-select-search.component.html'
})

export class MultiSelectSearchComponent implements OnInit, OnDestroy, OnChanges {

    constructor(
        private formBuilder: FormBuilder,
        private bomService: BomService
    ) { }

    form: FormGroup;

    subscriptions: Subscription[] = [];

    @Output() selectionUpdate = new EventEmitter<BomSearchData[]>();
    @Input() config: BomFilterItemConfig;


    filtered: BomSearchData[];
    ngOnInit(): void {
        this.formInit();
        this.startSubscription();
    }

    formInit() {
        this.form = this.formBuilder.group({
            searchInput: [ '' ],
            selected: [ this.config.preSelected ]
        })

        if (this.config.preSelected && this.config.preSelected.length) {
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

    startSubscription() {
        this.subscriptions.push(
            this.bomService.resetBomFilter$.subscribe(_ => {
                if (this.config.key !== 'tradeNames') {
                    this.form.reset();
                }
            })
        )
    }

    ngOnDestroy() {
        this.subscriptions.forEach(item => item.unsubscribe);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config) {
            this.form.get('selected').setValue(this.config.preSelected);
            this.form.get('selected').updateValueAndValidity();
        }
    }

    compareValues(Val1: any, val2: any): boolean {
        return Val1.id === val2.id;
    }

}