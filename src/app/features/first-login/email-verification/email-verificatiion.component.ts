import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-email-verification',
    templateUrl: 'email-verification.component.html'
})

export class EmailVerificationComponent implements OnInit {
    constructor() { }
    email: string = ""
    ngOnInit() {
        this.email = "apaarseth@gmail.com"
    }
}