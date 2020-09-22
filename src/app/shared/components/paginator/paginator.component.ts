import { PaginatorConfig } from './../../models/common.models';
import { Component, Input, Output, OnInit, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html'
})

export class PaginatorComponent implements OnInit, OnChanges {

    @Output() updatePaginator = new EventEmitter<PaginatorConfig>();
    @Input() config: PaginatorConfig;

    length: number;
    pageSize = 25;
    pageSizeOptions: number[] = [ 25, 50, 75, 100 ];

    ngOnInit(): void {
        this.length = this.config.totalCount ? this.config.totalCount : 25;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.config) {
            this.length = this.config.totalCount ? this.config.totalCount : 25;
        }
    }

    pageEvent(event) {
        this.config.limit = event.pageSize;
        this.config.pageNumber = event.pageIndex + 1;
        this.config.totalCount = event.length;
        this.updatePaginator.emit(this.config);
    }

}