import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'card-layout',
    templateUrl: 'card-layout-template.html'
})
export class CardLayoutComponent implements OnInit {

    @Output('submitForm') submitForm = new EventEmitter();
    @Input('isNonProfile') isNonProfile: boolean; // if address type is not billing or delivery 

    @Output('onCancel') onCancel = new EventEmitter();

    @Input('addressType') addressType: string;



    ngOnInit(): void {

        

    }


    startSubscriptions() {
        // this.subscriptions.push(
        //     this._activatedRout.params.subscribe(params => {
        //         if (params.type) {
        //             this.addrs.addressCategory = params.type.toUpperCase();
        //         }


        //         if (params.addressId) {
        //             this.getAddress(params.addressId);
        //         } else {
        //             if (!this.addressForm) {
        //                 this.formInit();
        //             }
        //         }


        //     }),

        //     this._activatedRout.url.subscribe(url => {
        //         this.isEdit = url[ 2 ].path == 'edit';
        //     })
        // );
    }

}
