import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { POService } from '../../services/po/po.service';
import { SavePaymnetRecord, PaymentHistory, PoPayementDetail, PurchaseOrder } from '../../models/PO/po-data';
import { CommonService } from '../../services/commonService';

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
        private dialogRef: MatDialogRef<PaymentRecordComponent>,
        @Inject(MAT_DIALOG_DATA) public poDetail: PurchaseOrder) { }


    ngOnInit() {
        this.startDate = new Date(this.poDetail.createdAt);
        this.endDate = this.poDetail.validUpto ? new Date(this.poDetail.validUpto) : null;
        this.poService.paymentDetail(this.poDetail.purchaseOrderId).then(res => {
            this.paymentDetail = res.data[0];
            this.formInit()
        })
    }
    formInit() {
        this.paymentForm = this.formBuilder.group({
            amountPaid: ['', [Validators.required, this.quantityCheck(this.paymentDetail.poAmount)]],
            paymentDate: ['', Validators.required],
            transactionId: []
        })
    }

    quantityCheck(poAmount): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (poAmount < control.value) {
                this._snackBar.open(
                    "Cannot add quantity greater than " + poAmount,
                    "",
                    {
                        duration: 2000,
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
            this.poService.paymentHistory(this.poDetail.purchaseOrderId).then(res => {

                this.dataSource = res.data as PaymentHistory[];
            });
            // this.dataSource = [{ amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }, { amountPaid: 455, date: '25 - 08 - 20', transactionId: 13123123, addedBy: 'Rikesh' }]
        }
    }

    onSubmit() {
        let submitData: SavePaymnetRecord = this.paymentForm.value;
        submitData.amountPaid = Number(submitData.amountPaid)
        submitData.paymentDate = this.commonService.getFormatedDate(submitData.paymentDate)
        this.poService.paymentRecord(this.poDetail.purchaseOrderId, submitData)
        this.dialogRef.close(null);
    }
}