import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AdvSearchItemConfig } from './../../models/adv-search.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdvanceSearchService } from 'src/app/shared/services/advance-search.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'adv-input-number-item',
    templateUrl: './adv-input-number-item.component.html'
})

export class AdvanceInputNumberItemComponent implements OnInit {

    form: FormGroup;

    constructor(
        private FormBuilder: FormBuilder,
        private advSearchService: AdvanceSearchService
    ) { }

    @Output() selectionUpdate = new EventEmitter<number[]>();
    @Input() config: AdvSearchItemConfig;

    subscriptions: Subscription[] = [];
    isOpen: boolean;

    ngOnInit(): void {
        this.formInit();
        this.startSubscription();
    }

    formInit() {
        this.form = this.FormBuilder.group({
            min: [ '' ],
            max: [ '' ]
        })

        this.form.valueChanges.subscribe(val => {
            if (val[ 'min' ]) {
                val[ 'min' ] = Number(val[ 'min' ]);
            }
            if (val[ 'max' ]) {
                val[ 'max' ] = Number(val[ 'max' ]);
            }
            this.selectionUpdate.emit(val);
        })
    }

    checkAmount(event) {
        event.currentTarget.value = event.currentTarget.value;
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