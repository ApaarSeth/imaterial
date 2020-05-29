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
import { Currency } from '../../models/currency';


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
  currencies: CountryCurrency[];
  form: FormGroup;
  currencyFields: rfqCurrency;
  exchangeCurrencyName: string;
  primaryCurrencyName: string;
  searchText: string = null;
  primaryImageUrl: string;
  primaryCurrencyData: Currency;

  constructor(
    private dialogRef: MatDialogRef<SelectCurrencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: rfqCurrency,
    private router: Router,
    private _snackBar: MatSnackBar,
    private rfqservice: RFQService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.currencyForm();
    this.getCurrencyApi();
  }
  get selectedCountry() {
    if (this.currencies)
      return this.form.get('exchangeCurrency').value;
  }


  getCurrencyApi() {
    this.currencyFields = this.data;
    if (this.data! = null) {
      this.exchangeCurrencyName = this.data.exchangeCurrencyName;
    }
    Promise.all([this.commonService.getBaseCurrency(), this.rfqservice.getCurrency()]).then(res => {
      this.primaryCurrencyData = res[0].data as Currency;
      this.currencyFields.primaryContryId = String(this.primaryCurrencyData.countryId);
      this.currencyFields.primaryCurrency = this.primaryCurrencyData.currency;
      this.currencyFields.primaryCurrencyFlag = this.primaryCurrencyData.imageUrl;
      this.currencyFields.primaryCurrencyId = this.primaryCurrencyData.currencyId;
      this.currencyFields.primaryCurrencyName = this.primaryCurrencyData.currencyCode;
      this.currencyFields.primaryCurrencySymbol = this.primaryCurrencyData.symbol;
      this.primaryImageUrl = this.primaryCurrencyData.imageUrl;
      this.primaryCurrencyName = this.primaryCurrencyData.currencyCode;
      this.currencies = res[1].data.filter(value => {
        return value.countryId !== this.primaryCurrencyData.countryId
      });
      let existingCurrency = this.currencies.filter(value => {
        return value.currencyId === this.currencyFields.exchangeCurrencyId;
      })
      this.form.get('exchangeCurrency').setValue(existingCurrency[0]);
    });
  }

  currencyForm() {
    this.form = this.formBuilder.group({
      exchangeCurrency: [
        '',
        Validators.required
      ],
      exchangeValue: [
        this.data != null && this.data.exchangeValue ? this.data.exchangeValue : "",
        Validators.required
      ],
    });
  }


  setExchangeCurrency(event) {
    this.exchangeCurrencyName = event.value.currencyCode;
    console.log("NEW Value ::", event.value);
    console.log(this.form);
  }

  submit() {
    this.currencyFields.exchangeCountryId = String(this.form.value.exchangeCurrency.countryId);
    this.currencyFields.exchangeCurrency = this.form.value.exchangeCurrency.currency;
    this.currencyFields.exchangeCurrencyFlag = this.form.value.exchangeCurrency.imageUrl;
    this.currencyFields.exchangeCurrencyId = this.form.value.exchangeCurrency.currencyId;
    this.currencyFields.exchangeCurrencyName = this.form.value.exchangeCurrency.currencyCode;
    this.currencyFields.exchangeCurrencySymbol = this.form.value.exchangeCurrency.symbol;
    this.currencyFields.exchangeValue = Number(this.form.value.exchangeValue);
    this.dialogRef.close(this.currencyFields);
  }

  close() {
    this.dialogRef.close(null);
  }


}