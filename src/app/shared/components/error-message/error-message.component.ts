import { CommonService } from './../../services/commonService';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-error-message',
    templateUrl: 'error-message.component.html'
})

export class ErrorMessageComponent implements OnInit {

    @Input('msg') msg: string;
    @Input('width') iconwidth: string;
    @Input('positon') pos: string;

    position: string = 'below';
    width: string = null;
    isMobile: boolean;

    constructor(private commonService: CommonService) { }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.pos && changes.pos.currentValue) {
            this.position = changes.pos.currentValue
        }

        if (changes.iconwidth && changes.iconwidth.currentValue) {
            this.width = 'width-' + changes.iconwidth.currentValue + '-px'
        }
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.

    }

    ngAfterViewInit(): void {
        this.isMobile = this.commonService.isMobile().matches;
    }
}