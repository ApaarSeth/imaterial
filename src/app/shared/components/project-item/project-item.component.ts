import { Component, OnInit, Output, EventEmitter, OnDestroy, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectDetails } from '../../models/project-details';

@Component({
    selector: 'card-layout',
    templateUrl: 'project-item.component.html'
})
export class ProjectItemComponent implements OnInit {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute  
      ) {}

    @Output('onEdit') onEdit = new EventEmitter<number>();
    @Output('onDelete') onDelete = new EventEmitter<number>();
    @Input('projectDetails') projectDetails: ProjectDetails;
    ngOnInit(): void {

    }


    edit(proId:number,$event){
        this.onEdit.emit(proId);
        $event.stopPropagation();
    }

    delete(proId:number,$event){
        this.onDelete.emit(proId);
        $event.stopPropagation();
    }

    navigationToBOM(text:string,id: number){
        if(text == 'bom'){
          this.router.navigate(['/bom/'+id]);
        }
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
