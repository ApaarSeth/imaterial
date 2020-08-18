import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProjectDetails, ProjetPopupData } from "../../models/project-details";
import { ProjectService } from "../../services/project.service";
import { AddRFQ } from "../../models/RFQ/rfq-details";
import { RFQService } from "../../services/rfq.service";
import { AppNavigationService } from '../../services/navigation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "add-rfq-double-confirmation-dialog",
  templateUrl: "add-rfq-double-confirmation-component.html"
})
export class AddRFQConfirmationComponent implements OnInit {
  rfqDetails: AddRFQ;
  selectBuildsupplyAsSupplier: boolean = true;
  constructor(
    private dialogRef: MatDialogRef<AddRFQConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dataKey: AddRFQ },
    private rfqService: RFQService,
    private navService: AppNavigationService
  ) { }

  ngOnInit() {
    this.rfqDetails = this.data.dataKey;
    this.rfqDetails.rfqCurrency.exchangeValue
  }

  get exchangeCurrency() {
    return this.rfqDetails.rfqCurrency ? this.rfqDetails.rfqCurrency.exchangeCurrencyName : null
  }

  get primaryCurrency() {
    return this.rfqDetails.rfqCurrency ? this.rfqDetails.rfqCurrency.primaryCurrencyName : null
  }

  get exchangeValue() {
    return this.rfqDetails.rfqCurrency ? this.rfqDetails.rfqCurrency.exchangeValue : null
  }

  getExcha
  close(data) {
    this.dialogRef.close(data);
  }

  addRFQ() {
    (<AddRFQ>this.data.dataKey).selectBuildsupplyAsSupplier = true;
    this.rfqService.addRFQ(this.data.dataKey).then(res => {
      this.navService.gaEvent({
        action: 'submit',
        category: 'Rfq_floated',
        label: 'rfq-name',
        value: null
      });
      this.close(res);
    });
  }
}
