import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-error-message',
    templateUrl: 'error-message.component.html'
})

export class ErrorMessageComponent implements OnInit {

    @Input('msg') msg: string;
    @Input('positon') pos: string;


    constructor() { }
    position: string = 'below';
    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.pos && changes.pos.currentValue) {
            this.position = changes.pos.currentValue
        }
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.

    }
}