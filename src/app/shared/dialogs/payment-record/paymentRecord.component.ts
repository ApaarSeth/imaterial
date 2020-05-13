import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-payment-record',
    templateUrl: 'paymentRecord.component.html'
})

export class PaymentRecordComponent implements OnInit {
    displayedColumns: string[] = ["Amount Paid", "Date", "Transaction ID", "Added By"];
    dataSource = []
    paymentForm: FormGroup
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<PaymentRecordComponent>,
        @Inject(MAT_DIALOG_DATA) public data) { }


    ngOnInit() { this.formInit() }
    formInit() {
        this.paymentForm = this.formBuilder.group({
            amountPaid: ['', Validators.required],
            paymentDate: ['', Validators.required],
            transactionId: []
        })
    }
    closeDialog() {
        this.dialogRef.close(null);
    }

    tabClick(event) {
        if (event.index === 1) {
            this.dataSource = [{ amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }]
        }
    }
}