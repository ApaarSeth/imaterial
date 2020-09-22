import { EventEmitter } from '@angular/core';
import { AdvanceSearchService } from 'src/app/shared/services/advance-search.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdvSearchData, AdvSearchItemConfig } from './../../models/adv-search.model';
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
    selector: 'adv-search-item',
    templateUrl: './adv-search-item.component.html'
})

export class AdvSearchItemComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder,
        private advSearchService: AdvanceSearchService
    ) { }

    form: FormGroup;

    @Output() selectionUpdate = new EventEmitter<number[]>();
    @Input() config: AdvSearchItemConfig;

    subscriptions: Subscription[] = [];


    filtered: AdvSearchData[];
    ngOnInit(): void {
        this.formInit();
        this.startSubscription();
    }

    formInit() {
        this.form = this.formBuilder.group({
            searchInput: [ '' ],
            selected: []
        })

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

    remove(id) {
        const oldVal = this.form.get('selected').value;
        const newVal = oldVal.filter(itm => itm.id !== id);
        this.form.get('selected').setValue(newVal);
    }

    startSubscription() {
        this.subscriptions.push(
            this.advSearchService.clearFilter$.subscribe(res => {
                if (res) {
                    this.form.reset();
                }
            })
        )
    }

    ngOnDestroy() {
        this.subscriptions.forEach(itm => itm.unsubscribe());
    }

}