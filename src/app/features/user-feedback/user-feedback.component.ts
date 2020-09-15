import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-user-feedback',
    templateUrl: 'user-feedback.component.html'
})

export class UserFeedbackComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

    onSubmit(form: NgForm) {
        console.log(form.value)
    }
}