import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { POService } from '../../services/po/po.service';
import { SavePaymnetRecord, PaymentHistory, PoPayementDetail } from '../../models/PO/po-data';
import { CommonService } from '../../services/commonService';

@Component({
    selector: 'app-payment-record',
    templateUrl: 'paymentRecord.component.html'
})

export class PaymentRecordComponent implements OnInit {
    displayedColumns: string[] = ["Amount Paid", "Date", "Transaction ID", "Added By"];
    dataSource: PaymentHistory[] = []
    paymentForm: FormGroup
    paymentDetail: PoPayementDetail = null;
    constructor(
        private commonService: CommonService,
        private poService: POService,
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<PaymentRecordComponent>,
        @Inject(MAT_DIALOG_DATA) public poId: number) { }


    ngOnInit() {
        this.poService.paymentDetail(this.poId).then(res => {
            this.paymentDetail = res.data[0];
        })
        this.formInit()
    }
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
            this.poService.paymentHistory(this.poId).then(res => {
                this.dataSource = res.data as PaymentHistory[];
            });
            // this.dataSource = [{ amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }]
        }
    }

    onSubmit() {
        let submitData: SavePaymnetRecord = this.paymentForm.value;
        submitData.amountPaid = Number(submitData.amountPaid)
        submitData.paymentDate = this.commonService.getFormatedDate(submitData.paymentDate)
        this.poService.paymentRecord(this.poId, submitData)
        this.dialogRef.close(null);
    }
}