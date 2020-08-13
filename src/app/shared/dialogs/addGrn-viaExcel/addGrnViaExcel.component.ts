import { Component, OnInit, Inject } from '@angular/core';
import { GlobalLoaderService } from '../../services/global-loader.service';
import { BomService } from '../../services/bom/bom.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackbarComponent } from '../snackbar/snackbar.compnent';
import { ConfirmRfqBidComponent } from '../confirm-rfq-bid/confirm-frq-bid-component';
import { GRNService } from '../../services/grn/grn.service';
import { AppNotificationService } from '../../services/app-notification.service';

@Component({
    selector: 'add-grn-viaExcel',
    templateUrl: 'addGrnViaExcel.component.html'
})

export class AddGrnViaExcelComponent implements OnInit {

    projectId: number;

    constructor(private loading: GlobalLoaderService,
        private dialogRef: MatDialogRef<AddGrnViaExcelComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private notifier: AppNotificationService,
        private bomService: BomService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private grnService: GRNService
    ) { }

    ngOnInit() {
        this.projectId = this.data
    }


    uploadExcel(files: FileList) {
        const data = new FormData();
        data.append("file", files[0]);
        var fileSize = files[0].size; // in bytes
        if (fileSize < 5000000) {
            this.postMaterialExcel(data);
        }
        else {
            this._snackBar.open("File must be less than 5 mb", "", {
                duration: 2000,
                panelClass: ["success-snackbar"],
                verticalPosition: "bottom"
            });
        }
    }

    postMaterialExcel(data) {
        this.loading.show();
        this.grnService.uploadGrnTempelate(data, this.projectId).then(res => {
            if (res.statusCode === 201) {
                this.router.navigate(["project-dashboard/bom/" + this.projectId + "/bom-detail"]);
                this.loading.hide();
                this.notifier.snack(res.message)
                this.dialogRef.close('success')
            } else {
                this.notifier.snack(res.message)
            }
        }).catch(err => {
            this.notifier.snack(err.message)
        })
            ;
    }

    downloadExcel() {
        this.grnService.downloadGrnTempelate(this.data)
            .then(res => {
                var win = window.open(res.data.url, "_blank");
                win.focus();
            })

    }

    cancel() {
        this.dialogRef.close(null)
    }
}