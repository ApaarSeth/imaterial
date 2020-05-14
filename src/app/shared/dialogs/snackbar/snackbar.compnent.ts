import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
    selector: 'app-snackbar',
    templateUrl: 'snackbar.component.html'
})

export class SnackbarComponent implements OnInit {

    objectKeys = Object.keys;
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

    ngOnInit() {


    }
}