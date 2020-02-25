import { Component, OnInit, Inject } from "@angular/core";
import { RFQService } from "../../services/rfq/rfq.service";
import { RfqTerms } from "../../models/RFQ/rfq-terms";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { POData } from "../../models/PO/po-data";
import { AddRFQ } from "../../models/RFQ/rfq-details";
import { Router } from '@angular/router';

@Component({
  selector: "app-selectrfq-terms",
  templateUrl: "./selectrfq-terms.component.html"
})
export class SelectRfqTermsComponent implements OnInit {
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<SelectRfqTermsComponent>,
    private formBuilder: FormBuilder,
    private rfqService: RFQService,
    @Inject(MAT_DIALOG_DATA) public data: AddRFQ
  ) { }
  rfqTerms: RfqTerms[] = [];
  termsForm: FormGroup;
  customTermForm: FormGroup;
  ngOnInit() {
    this.rfqService.getRfqTerms().then(res => {
      this.rfqTerms = res.data as RfqTerms[];
    });
    this.formInit();
  }
  formInit() {
    this.termsForm = this.formBuilder.group({
      term: [this.rfqTerms[0], [Validators.required]]
    });
    this.customTermForm = this.formBuilder.group({
      customTerm: []
    });
  }

  close() {
    this.rfqService.addRFQ(this.data).then(res => {
      let finalRfq = res.data;
      this.router.navigate(["/rfq/review/"], {
        state: { finalRfq }
      });
    });
    this.dialogRef.close();
  }
  submitRfq() {
    this.data.terms = {
      termsId: this.termsForm.value.term.termsId,
      termsDesc: this.termsForm.value.term.termsDesc !== "Others" ? this.termsForm.value.term.termsDesc : this.customTermForm.value.customTerm.termsDesc,
      termsType: "RFQ"
    };
    this.rfqService.addRFQ(this.data).then(res => {
      let finalRfq = res.data;
      this.router.navigate(["/rfq/review/"], {
        state: { finalRfq }
      });
    });
  }
}
