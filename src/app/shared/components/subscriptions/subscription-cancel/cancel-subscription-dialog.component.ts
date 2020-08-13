import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Input, Inject } from "@angular/core";
import { CommonService } from 'src/app/shared/services/commonService';

@Component({
    selector: 'cancel-subscription-dialog',
    templateUrl: './cancel-subscription-dialog.component.html'
})

export class CancelSubscriptionDialog implements OnInit {

    isMobile: boolean;

    constructor(
        private dialogRef: MatDialogRef<CancelSubscriptionDialog>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.isMobile = this.commonService.isMobile().matches;
    }

    closeDialog(): void {
        this.dialogRef.close(null);
    }

    cancelSubscription() {
        this.dialogRef.close(true);
    }
}