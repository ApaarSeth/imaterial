import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { Router } from '@angular/router';
import { RFQService } from '../../services/rfq/rfq.service';
import { rfqCurrency, CountryCurrency } from '../../models/RFQ/rfq-details';


export interface City {
  value: string;
  viewValue: string;
}

export interface ProjectType {
  type: string;
}

export interface Unit {
  value: string;
}

@Component({
  selector: "select-currency-dialog",
  templateUrl: "select-currency.component.html"
})

export class SelectCurrencyComponent implements OnInit {
  currencies : CountryCurrency[];  
  form : FormGroup;
  currencyFields: rfqCurrency;
  exchangeCurrencyName: string;
  primaryCurrencyName: string;
  
  constructor(

    private dialogRef: MatDialogRef<SelectCurrencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: rfqCurrency,
    private router: Router,
    private _snackBar: MatSnackBar,
    private rfqservice : RFQService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.primaryCurrencyName = "INR";
    this.rfqservice.getCurrency().then(res => {
      this.currencies = res.data;
    });
    this.currencyFields = this.data;
    this.currencyForm();
  }
  
  currencyForm(){
    this.form = this.formBuilder.group({
       exchangeCurrencyId: [
        this.data.exchangeCurrencyId ? this.data.exchangeCurrencyId : "",
        Validators.required
      ],
      exchangeValue: [
        this.data.exchangeValue ? this.data.exchangeValue : "",
        Validators.required
      ],
      primaryCurrencyId: [this.data.primaryCurrencyId ? this.data.primaryCurrencyId: ""]
    });

  }
  setExchangeCurrency(event){
    this.exchangeCurrencyName = event.value.currencyCode;
  }
  submit(){
    this.form.value.exchangeCurrencyId = this.form.value.exchangeCurrencyId.currencyId;
    console.log(this.form.value);
  }
  close() {
    this.dialogRef.close(null);
  }

}