
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { AdvSearchItemConfig } from './../../models/adv-search.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdvanceSearchService } from 'src/app/shared/services/advance-search.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'adv-date-item',
    templateUrl: './adv-date-item.component.html'
})

export class AdvanceDateItemComponent implements OnInit, OnDestroy {

    form: FormGroup;

    constructor(
        private FormBuilder: FormBuilder,
        private advSearchService: AdvanceSearchService
    ) { }

    @Output() selectionUpdate = new EventEmitter<number[]>();
    @Input() config: AdvSearchItemConfig;

    subscriptions: Subscription[] = [];
    isOpen: boolean;

    minDate: any;
    maxDate: any;

    ngOnInit(): void {
        this.formInit();
        this.startSubscription();
    }

    formInit() {
        this.form = this.FormBuilder.group({
            from: [ '' ],
            to: [ '' ]
        })

        this.form.valueChanges.subscribe(val => {
            val[ 'from' ] ? val[ 'from' ] : null;
            val[ 'to' ] ? val[ 'to' ] : null;
            this.selectionUpdate.emit(val);
        })
    }

    checkFromDate() {
        let d1 = new Date(this.form.get('from').value);
        let d2 = new Date(this.form.get('to').value);
        this.maxDate = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
        if (this.form.get('from').value) {
            if (d2.getTime() < d1.getTime()) {
                this.form.get('to').setValue('');
            }
        }
    }
    checkToDate() {
        let d1 = new Date(this.form.get('from').value);
        let d2 = new Date(this.form.get('to').value);
        this.minDate = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
        if (this.form.get('to').value) {
            if (d2.getTime() < d1.getTime()) {
                this.form.get('from').setValue('');
            }
        }
    }

    startSubscription() {
        this.subscriptions.push(
            this.advSearchService.clearFilter$.subscribe(res => {
                if (res) {
                    this.form.reset();
                    this.isOpen = false;
                }
            })
        )
    }

    ngOnDestroy() {
        this.subscriptions.forEach(itm => itm.unsubscribe());
    }
}