import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { TaxInfo, OtherCostInfo } from '../../models/tax-cost.model';
import { TaxCostService } from '../../services/taxcost.service';

@Component({
  selector: 'app-tax-cost',
  templateUrl: './tax-cost.component.html'
})
export class TaxCostComponent implements OnInit {

  taxCostForm: FormGroup;
  otherCostForm: FormGroup;
  rfqId: number;

  constructor(
    public dialogRef: MatDialogRef<TaxCostComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private taxcostService: TaxCostService
  ) { }

  ngOnInit() {
    if (this.data.type === 'taxesAndCost') {
      this.taxCostFormInit();
      this.addNewTaxField();
      this.addNewOtherField();
      this.taxCostForm.setValidators(this.validationOnTaxCostForm);
    }
    if (this.data.type === 'otherCost') {
      this.otherCostFormInit();
      this.addNewOtherField();
      this.otherCostForm.setValidators(this.validationOnOtherCostForm);
    }
    this.rfqId = this.data.rfqId;
  }

  validationOnTaxCostForm(form) {
    const txInfo = form.value.taxInfo.some(item => {
      if (item.taxName && item.taxValue) {
        return item;
      }
    });
    const ocInfo = form.value.otherCostInfo.some(item => {
      if (item.otherCostName && item.otherCostAmount) {
        return item;
      }
    });
    return txInfo || ocInfo ? null : { ocInfo };
  }

  validationOnOtherCostForm(form) {
    const ocInfo = form.value.otherCostInfo.some(item => {
      if (item.otherCostName && item.otherCostAmount) {
        return item;
      }
    });
    return ocInfo ? null : { ocInfo };
  }

  taxCostFormInit() {
    this.taxCostForm = this.formBuilder.group({
      otherCostInfo: new FormArray([]),
      taxInfo: new FormArray([]),

    });
  }

  otherCostFormInit() {
    this.otherCostForm = this.formBuilder.group({
      otherCostInfo: new FormArray([])
    });
  }

  addNewTaxField() {
    const control = this.formBuilder.group({
      taxName: new FormControl(''),
      taxValue: new FormControl(null)
    });
    (<FormArray>this.taxCostForm.get('taxInfo')).push(control);
  }

  addNewOtherField() {
    const control = this.formBuilder.group({
      otherCostName: new FormControl(''),
      otherCostAmount: new FormControl(null)
    });
    if (this.data.type === 'taxesAndCost') {
      (<FormArray>this.taxCostForm.get('otherCostInfo')).push(control);
    }
    if (this.data.type === 'otherCost') {
      (<FormArray>this.otherCostForm.get('otherCostInfo')).push(control);
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  deleteField(type: string, i: number) {
    let item;
    if (this.data.type === 'taxesAndCost') {
      item = this.taxCostForm.get(type) as FormArray;
    }
    if (this.data.type === 'otherCost') {
      item = this.otherCostForm.get(type) as FormArray;
    }
    item.removeAt(i);
    item.updateValueAndValidity();
  }

  onSubmitTaxCost() {
    if (this.taxCostForm.valid) {
      let data = {
        organizationId: 0,
        rfqId: this.rfqId,
        taxInfo: [],
        otherCostInfo: []
      }
      if (this.taxCostForm.value.taxInfo.length) {
        this.taxCostForm.value.taxInfo.forEach(itm => {
          if (itm.taxName && itm.taxValue) {
            let taxItm = {
              id: 0,
              status: 0,
              createdBy: "",
              createdAt: "",
              lastUpdatedBy: "",
              lastUpdatedAt: "",
              taxId: null,
              taxName: itm.taxName,
              taxDescription: null,
              taxValue: itm.taxValue,
              organizationId: 0,
            } as TaxInfo;
            data.taxInfo.push(taxItm);
          }
        });
        this.taxCostForm.value.otherCostInfo.forEach(itm => {
          if (itm.otherCostAmount && itm.otherCostAmount) {
            let otItm = {
              id: 0,
              status: 0,
              createdBy: "",
              createdAt: "",
              lastUpdatedBy: "",
              lastUpdatedAt: "",
              otherCostId: null,
              otherCostName: itm.otherCostName,
              otherCostDescription: null,
              otherCostAmount: itm.otherCostAmount,
              organizationId: 0,
            } as OtherCostInfo;
            data.otherCostInfo.push(otItm);
          }
        });
      }
      if (this.data.po) {
        this.taxcostService.poTaxCostData(data)
          .then(res => {
            this.dialogRef.close(res.data);
          });
      } else {
        this.taxcostService.postTaxCostData(data)
          .then(res => {
            this.dialogRef.close(res.data);
          });
      }

    }
  }

  onSubmitOtherCost() {
    if (this.otherCostForm.valid) {
      let data = {
        organizationId: 0,
        rfqId: this.rfqId,
        otherCostInfo: [],
        taxInfo: []
      }
      this.otherCostForm.value.otherCostInfo.forEach(itm => {
        if (itm.otherCostAmount && itm.otherCostAmount) {
          let otItm = {
            id: 0,
            status: 0,
            createdBy: "",
            createdAt: "",
            lastUpdatedBy: "",
            lastUpdatedAt: "",
            otherCostId: null,
            otherCostName: itm.otherCostName,
            otherCostDescription: null,
            otherCostAmount: itm.otherCostAmount,
            organizationId: 0,
          } as OtherCostInfo;
          data.otherCostInfo.push(otItm);
        }
      });
      this.taxcostService.postTaxCostData(data)
        .then(res => {
          this.dialogRef.close(res.data);
        });
    }
  }

}
