import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/commonService';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'trial-active',
    templateUrl: './trial-active.component.html'
})

export class TrialActiveComponent implements OnInit {

    constructor(
        private commonService: CommonService,
        private router: Router
    ) { }

    isMobile: boolean;
    email: string;
    phoneNo: string;

    ngOnInit(): void {
        this.isMobile = this.commonService.isMobile().matches;
        this.email = localStorage.getItem('email');
        this.phoneNo = localStorage.getItem('phoneNo');
    }

    addProject(): void {
        this.router.navigate([ '/project-dashboard' ], { queryParams: { 'openAddProject': 1 } });
    }

    openCallendly(): void {
        this.commonService.openCallendly(this.email, this.phoneNo);
    }

    closeDialog(): void {
        this.router.navigate([ '/dashboard' ]);
    }

}