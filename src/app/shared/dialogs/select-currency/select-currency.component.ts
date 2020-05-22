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
  searchText: string = null;
  primaryImageUrl: string;
  
  constructor(

    private dialogRef: MatDialogRef<SelectCurrencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: rfqCurrency,
    private router: Router,
    private _snackBar: MatSnackBar,
    private rfqservice : RFQService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.currencyForm();
    this.getCurrencyApi();
  }

  getCurrencyApi(){
    this.rfqservice.getBaseCurrency().then(res => {
      this.primaryImageUrl = res.data.imageUrl
      this.primaryCurrencyName = res.data.currencyCode;
    })
    this.form.get('primaryCurrencyFlag').setValue(this.primaryImageUrl);
    
    this.rfqservice.getCurrency().then(res => {
      this.currencies = res.data;
      let existingCurrency = this.currencies.filter(value => {
        return value.currencyId === this.data.exchangeCurrencyId
      })
     this.form.get('exchangeCurrencyId').setValue(existingCurrency[0]);
    });

    this.currencyFields = this.data;
    this.exchangeCurrencyName = this.data.exchangeCurrencyName;
  }
  
  currencyForm(){
    this.form = this.formBuilder.group({
       exchangeCurrencyId: [
        '',
        Validators.required
      ],
      exchangeCurrencyName : [''],
      exchangeValue: [
        this.data.exchangeValue ? this.data.exchangeValue : "",
        Validators.required
      ],
      primaryCurrencyId: [this.data.primaryCurrencyId ? this.data.primaryCurrencyId: 3],
      primaryCurrencyName: [''],
      exchangeCurrencyFlag : [''],
      primaryCurrencyFlag : [''],
    });
  }
  setExchangeCurrency(event){
    this.exchangeCurrencyName = event.value.currencyCode;
    console.log("NEW Value ::", event.value);
    console.log(this.form);
  }
  submit(){
    this.form.value.exchangeCurrencyName = this.form.value.exchangeCurrencyId.currencyCode;
    this.form.value.primaryCurrencyName = this.primaryCurrencyName;
    this.form.value.exchangeCurrencyFlag = this.form.value.exchangeCurrencyId.imageUrl;
    this.form.value.primaryCurrencyFlag = this.data.primaryCurrencyFlag;
    this.form.value.exchangeValue = Number(this.form.value.exchangeValue);
    this.form.value.exchangeCurrencyId = this.form.value.exchangeCurrencyId.currencyId;
    this.dialogRef.close(this.form.value);
  }
  close() {
    this.dialogRef.close(null);
  }

}