import { OnDestroy } from '@angular/core';
import { BomService } from 'src/app/shared/services/bom.service';
import { Subscription } from 'rxjs';
import { BomFilterItemConfig } from './../../models/bom.model';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'input-text-search',
    templateUrl: './input-text-search.component.html'
})

export class InputTextSearchCompoent implements OnInit, OnDestroy {

    form: FormGroup

    constructor(
        private formBuilder: FormBuilder,
        private bomService: BomService
    ) { }

    @Output() selectionUpdate = new EventEmitter<string>();
    @Input() config: BomFilterItemConfig;

    subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.formInit();
        this.startSubscription();
    }

    formInit() {
        this.form = this.formBuilder.group({
            searchInput: [ '' ]
        })

        this.form.valueChanges.subscribe(val => {
            this.selectionUpdate.emit(val.searchInput);
        })
    }

    startSubscription() {
        this.subscriptions.push(
            this.bomService.resetBomFilter$.subscribe(_ => {
                this.form.reset();
            })
        )
    }

    ngOnDestroy() {
        this.subscriptions.forEach(item => item.unsubscribe);
    }

}
