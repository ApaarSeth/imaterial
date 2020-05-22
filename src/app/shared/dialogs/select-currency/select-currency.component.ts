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
import { CommonService } from '../../services/commonService';


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
    private formBuilder: FormBuilder,
    private commonService : CommonService
  ) { }

  ngOnInit() {
    
    this.currencyForm();
    this.getCurrencyApi();
  }

  getCurrencyApi(){
    this.currencyFields = this.data;
    if(this.data ! =null ){
      this.exchangeCurrencyName = this.data.exchangeCurrencyName;
    }

    this.commonService.getBaseCurrency().then(res => {
      this.primaryImageUrl = res.data.imageUrl;
      this.primaryCurrencyName = res.data.currencyCode;
    })
    this.form.get('primaryCurrencyFlag').setValue(this.primaryImageUrl);
    
    this.rfqservice.getCurrency().then(res => {
      this.currencies = res.data;
      let existingCurrency = this.currencies.filter(value => {
        return value.currencyId === this.currencyFields.exchangeCurrencyId;
      })
     this.form.get('exchangeCurrencyId').setValue(existingCurrency[0]);
    });   
    
  }
  
  currencyForm(){
    this.form = this.formBuilder.group({
       exchangeCurrencyId: [
        '',
        Validators.required
      ],
      exchangeCurrencyName : [''],
      exchangeValue: [
        this.data != null && this.data.exchangeValue ? this.data.exchangeValue : "",
        Validators.required
      ],
      primaryCurrencyId: [this.data != null && this.data.primaryCurrencyId ? this.data.primaryCurrencyId: 3],
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
    this.form.value.primaryCurrencyFlag = this.primaryImageUrl;
    this.form.value.exchangeValue = Number(this.form.value.exchangeValue);
    this.form.value.exchangeCurrencyId = this.form.value.exchangeCurrencyId.currencyId;
    this.dialogRef.close(this.form.value);
  }
  close() {
    this.dialogRef.close(null);
  }
  get selectedCountry() {
    if(this.currencies)
    return this.form.get('exchangeCurrencyId').value;
  }

}