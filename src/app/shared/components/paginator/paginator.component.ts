import { OnInit } from '@angular/core';
import { PaginatorConfig } from './../../models/common.models';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html'
})

export class PaginatorComponent implements OnInit {

    @Output() updatePaginator = new EventEmitter<PaginatorConfig>();
    @Input() config: any;

    length: number;
    pageSize = 25;
    pageSizeOptions: number[] = [ 25, 50, 75, 100 ];

    ngOnInit(): void {
        console.log(this.config, "pagination");
        this.length = this.config.totalCount ? this.config.totalCount : 25;
    }

    pageEvent(event) {
        this.config.limit = event.pageSize;
        this.config.pageNumber = event.pageIndex + 1;
        this.config.totalCount = event.length;
        this.updatePaginator.emit(this.config);
    }

}