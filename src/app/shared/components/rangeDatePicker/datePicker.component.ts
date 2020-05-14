import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-range-datePicker',
    templateUrl: 'datePicker.component.html'
})

export class RangeDatePicker implements OnInit {
    constructor(private formBuilder: FormBuilder) { }
    dateForm: FormGroup;
    rangeCriteria = ["Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "Custom"]
    ngOnInit() {
        this.formInit();
    }
    formInit() {
        this.dateForm = this.formBuilder.group({
            dateFilter: []
        })
    }
}