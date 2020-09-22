import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { AdvanceSearchService } from 'src/app/shared/services/advance-search.service';
import { Subscription } from 'rxjs';
import { AdvSearchItemConfig } from '../../models/adv-search.model';

@Component({
    selector: 'adv-select-item',
    templateUrl: './adv-select-item.component.html'
})

export class AdvanceSelectItemComponent implements OnInit {
    form: FormGroup;

    @Output() selectionUpdate = new EventEmitter<number[]>();
    @Input() config: AdvSearchItemConfig;
    @Input() clearFilter: boolean;

    subscriptions: Subscription[] = [];
    isOpen: boolean;

    get ordersFormArray() {
        return this.form.controls.checkBoxes as FormArray;
    }

    constructor(
        private formBuilder: FormBuilder,
        private advSearchService: AdvanceSearchService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            checkBoxes: new FormArray([])
        });
        this.formInit();
        this.startSubscription();
    }

    formInit(): void {
        this.config.list.forEach(() => this.ordersFormArray.push(new FormControl(false)))

        this.form.valueChanges.subscribe(val => {
            const selectedOrderIds = this.form.value.checkBoxes.map((checked, i) => checked ? this.config.list[ i ].id : null).filter(v => v !== null);
            this.selectionUpdate.emit(selectedOrderIds);
        })
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