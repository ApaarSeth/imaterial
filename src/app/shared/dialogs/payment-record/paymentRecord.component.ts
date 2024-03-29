import { AppNotificationService } from './../../services/app-notification.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { POService } from '../../services/po.service';
import { SavePaymnetRecord, PaymentHistory, PoPayementDetail, PurchaseOrder } from '../../models/PO/po-data';
import { CommonService } from '../../services/commonService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-payment-record',
    templateUrl: 'paymentRecord.component.html'
})

export class PaymentRecordComponent implements OnInit {
    startDate: Date;
    endDate: Date;
    displayedColumns: string[] = ["Amount Paid", "Date", "Transaction ID", "Added By"];
    dataSource: PaymentHistory[] = []
    paymentForm: FormGroup
    paymentDetail: PoPayementDetail = null;
    constructor(
        private _snackBar: MatSnackBar,
        private commonService: CommonService,
        private poService: POService,
        private formBuilder: FormBuilder,
        private notifier: AppNotificationService,
        private dialogRef: MatDialogRef<PaymentRecordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { poDetail: PurchaseOrder, paymentDetail: PoPayementDetail }) { }


    ngOnInit() {
        this.endDate = new Date()
        // this.startDate = new Date(this.data.poDetail.createdAt);
        // this.endDate = this.data.poDetail.validUpto ? new Date(this.data.poDetail.validUpto) : null;
        this.paymentDetail = this.data.paymentDetail
        if (this.paymentDetail.purchaseOrderCurrency) {
            this.displayedColumns.splice(1, 0, "Exchange Rate")
        }
        this.formInit()
    }
    formInit() {
        this.paymentForm = this.formBuilder.group({
            amountPaid: ['', [Validators.required, this.amountCheck(this.paymentDetail)]],
            paymentDate: ['', Validators.required],
            transactionId: ['', Validators.maxLength(300)],
            exchangeRate: ['', this.paymentDetail.purchaseOrderCurrency ? Validators.required : null]
        })
    }

    amountCheck(paymentDetail: PoPayementDetail): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            let checkValue = paymentDetail.totalPoAmount - paymentDetail.paymentRecived;
            if (checkValue < control.value) {
                this._snackBar.open(
                    "Cannot add amount greater than " + checkValue,
                    "",
                    {
                        duration: 3000,
                        panelClass: ["warning-snackbar"],
                        verticalPosition: "bottom"
                    }
                );
                control.setValue(0)
                return { 'nameIsForbidden': true };
            }
            return null;
        }
    }
    closeDialog() {
        this.dialogRef.close(null);
    }

    tabClick(event) {
        if (event.index === 1) {
            this.poService.paymentHistory(this.data.poDetail.purchaseOrderId).then(res => {
                this.dataSource = res.data as PaymentHistory[];
            });
            // this.dataSource = [{ amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }]
        }
    }

    onSubmit() {
        let submitData: SavePaymnetRecord = this.paymentForm.value;
        submitData.amountPaid = Number(submitData.amountPaid)
        submitData.paymentDate = this.commonService.getFormatedDate(submitData.paymentDate)
        this.poService.paymentRecord(this.data.poDetail.purchaseOrderId, submitData).then(res => {
            if (res.statusCode === 201) {
                this.notifier.snack("Record added Successfully")
                this.dialogRef.close(null)
            }
            else {
                this.notifier.snack(res.message)
            }
        })

    }
}