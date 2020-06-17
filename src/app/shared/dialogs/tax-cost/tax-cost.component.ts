import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TaxInfo, OtherCostInfo } from '../../models/tax-cost.model';
import { TaxCostService } from '../../services/taxcost.service';
import { CommonService } from '../../services/commonService';
import { Observable } from 'rxjs';
import { isTemplateExpression } from 'typescript';

@Component({
  selector: 'app-tax-cost',
  templateUrl: './tax-cost.component.html'
})
export class TaxCostComponent implements OnInit {
  taxCostForm: FormGroup;
  otherCostForm: FormGroup;
  rfqId: number;
  currentIndex: number = 0
  i
  filteredOptionsTax: TaxInfo[];
  filteredOptionsOther: OtherCostInfo[];
  filterOptionsTax: Observable<TaxInfo[]>;
  filterOptionsOther: Observable<OtherCostInfo[]>
  constructor(
    private _snackBar: MatSnackBar,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<TaxCostComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private taxcostService: TaxCostService
  ) { }

  ngOnInit() {
    let taxList = this.data.po ? this.commonService.poTaxesList() : this.commonService.taxesList(this.data.rfqId)
    taxList.then(res => {
      this.filteredOptionsTax = res.data.taxInfo
      this.filteredOptionsOther = res.data.otherCostInfo;
      if (this.data.type === 'taxesAndCost') {
        this.taxCostFormInit();
        if ((this.data.prevData && this.data.prevData[ 'dt' ] && Object.keys(this.data.prevData.dt).length) && (this.data.prevData.dt[ this.data.prevData.pId ] && this.data.prevData.dt[ this.data.prevData.pId ][ this.data.prevData.mId ])) {
          if (this.data.prevData.dt[ this.data.prevData.pId ][ this.data.prevData.mId ].taxInfo.length) {
            this.data.prevData.dt[ this.data.prevData.pId ][ this.data.prevData.mId ].taxInfo.forEach((itm, index) => {
              this.addNewTaxField();
              const txInfoArr = this.taxCostForm.get('taxInfo') as FormArray;
              const txItem = txInfoArr.at(index);
              txItem.get('taxName').setValue(itm);
              txItem.get('taxValue').setValue(itm.taxValue);
            });
          } else {
            this.addNewTaxField();
          }

          if (this.data.prevData && this.data.prevData.dt[ this.data.prevData.pId ][ this.data.prevData.mId ].otherCostInfo.length) {
            this.data.prevData.dt[ this.data.prevData.pId ][ this.data.prevData.mId ].otherCostInfo.forEach((itm, index) => {
              this.addNewOtherField();
              let othInfoArr = this.taxCostForm.get('otherCostInfo') as FormArray;
              let txItem = othInfoArr.at(index);
              txItem.get('otherCostName').setValue(itm);
              txItem.get('otherCostAmount').setValue(itm.otherCostAmount);
            });
          } else {
            this.addNewOtherField();
          }

        } else {
          this.addNewTaxField();
          this.addNewOtherField();
          this.setPoExistingValue()
        }
        this.taxCostForm.setValidators(this.validationOnTaxCostForm);
      }
      if (this.data.type === 'otherCost') {
        this.otherCostFormInit();
        if (this.data.prevData && this.data.prevData[ 'dt' ] && Object.keys(this.data.prevData.dt).length) {

          if (this.data.prevData.dt.otherCostInfo.length) {
            this.data.prevData.dt.otherCostInfo.forEach((itm, index) => {
              this.addNewOtherField();
              let othInfoArr = this.otherCostForm.get('otherCostInfo') as FormArray;
              let txItem = othInfoArr.at(index);
              txItem.get('otherCostName').setValue(itm);
              txItem.get('otherCostAmount').setValue(itm.otherCostAmount);
            });
          } else {
            this.addNewOtherField();
          }

        } else {
          this.addNewOtherField();
          this.setPoExistingValue();
        }
        this.otherCostForm.setValidators(this.validationOnOtherCostForm);
      }
      this.rfqId = this.data.rfqId;
    })
  }

  setPoExistingValue() {
    if (this.data.existingData && this.data.existingData.taxInfo) {
      const txInfoArr = this.taxCostForm.get('taxInfo') as FormArray;
      const othertxInfoArr = this.taxCostForm.get('otherCostInfo') as FormArray;
      this.data.existingData.taxInfo.forEach((element, i) => {
        if (i > 0) {
          txInfoArr.push(this.addtaxesFormGroup());
        }
        const txItem = txInfoArr.at(i);
        txItem.get('taxName').setValue(element);
        txItem.get('taxValue').setValue(element.taxValue);
      });
      this.data.existingData.otherCostInfo.forEach((element, i) => {
        if (i > 0) {
          othertxInfoArr.push(this.addOtherCostPercentFormGroup());
        }
        const txItem = othertxInfoArr.at(i);
        txItem.get('otherCostName').setValue(element);
        txItem.get('otherCostAmount').setValue(element.otherCostAmount);
      });
    }
    else if (this.data.existingData && this.data.existingData.otherCostInfo) {
      const txInfoArr = this.otherCostForm.get('otherCostInfo') as FormArray;
      this.data.existingData.otherCostInfo.forEach((element, i) => {
        if (i > 0) {
          txInfoArr.push(this.addOtherCostFormGroup());
        }
        const txItem = txInfoArr.at(i);
        txItem.get('otherCostName').setValue(element);
        txItem.get('otherCostAmount').setValue(element.otherCostAmount);
      });
    }
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
      otherCostInfo: this.formBuilder.array([]),
      taxInfo: this.formBuilder.array([])
    });
  }

  otherCostFormInit() {
    this.otherCostForm = this.formBuilder.group({
      otherCostInfo: this.formBuilder.array([])
    });
  }

  addtaxesFormGroup() {
    const frmGrp = this.formBuilder.group({
      taxName: [ '', Validators.required ],
      taxValue: [ null, { validators: [ Validators.required, Validators.min(1), Validators.max(100) ] } ]
    });
    frmGrp.controls[ 'taxName' ].valueChanges.subscribe(changes => {
      this.filterOptionsTax = null;
      const val: TaxInfo[] = this._taxfilter(changes)
      this.filterOptionsTax = new Observable((observer) => {
        observer.next(val)
        observer.complete()
      })
    })
    return frmGrp;
  }

  private _taxfilter(value: string | TaxInfo): TaxInfo[] {
    if (value || value === "") {
      const filterValue = typeof (value) === "string" ? value.toLowerCase() : value.taxName.toLowerCase();
      if (filterValue === '') {
        return this.filteredOptionsTax;
      }
      let filteredValue: TaxInfo[] | [ string ] = !this.filteredOptionsTax ? [] : this.filteredOptionsTax.filter(option => option.taxName.toLowerCase().includes(filterValue));
      if (!filteredValue.length) {
        filteredValue = [
          {
            id: 0,
            status: 0,
            createdBy: "",
            createdAt: "",
            lastUpdatedBy: "",
            lastUpdatedAt: "",
            taxId: null,
            taxName: typeof (value) === "string" ? value : value.taxName,
            taxDescription: null,
            taxValue: 0,
            organizationId: 0,
          } ]
      }
      return filteredValue;
    }
  }

  addOtherCostFormGroup() {
    const frmGrp = this.formBuilder.group({
      otherCostName: [ '', Validators.required ],
      otherCostAmount: [ null, { validators: [ Validators.required, Validators.min(1) ] } ]
    });
    frmGrp.controls[ 'otherCostName' ].valueChanges.subscribe(changes => {
      this.filterOptionsOther = null;
      const val: OtherCostInfo[] = this.otherCostfilter(changes)
      this.filterOptionsOther = new Observable((observer) => {
        observer.next(val)
        observer.complete()
      })
    })
    return frmGrp;
  }

  addOtherCostPercentFormGroup() {
    const frmGrp = this.formBuilder.group({
      otherCostName: ['', Validators.required],
      otherCostAmount: [null, { validators: [Validators.required, Validators.min(1), Validators.max(100)] }]
    });
    frmGrp.controls['otherCostName'].valueChanges.subscribe(changes => {
      this.filterOptionsOther = null;
      const val: OtherCostInfo[] = this.otherCostfilter(changes)
      this.filterOptionsOther = new Observable((observer) => {
        observer.next(val)
        observer.complete()
      })
    })
    return frmGrp;
  }


  private otherCostfilter(value: string | OtherCostInfo): OtherCostInfo[] {
    if (value || value === "") {
      const filterValue = typeof (value) === "string" ? value.toLowerCase() : value.
        otherCostName.toLowerCase();
      if (filterValue === '') {
        return this.filteredOptionsOther;
      }
      let filteredValue: OtherCostInfo[] | [ string ] = !this.filteredOptionsOther ? [] : this.filteredOptionsOther.filter(option => option.otherCostName.toLowerCase().includes(filterValue));
      if (!filteredValue.length) {
        filteredValue = [
          {
            id: 0,
            status: 0,
            createdBy: "",
            createdAt: "",
            lastUpdatedBy: "",
            lastUpdatedAt: "",
            otherCostId: null,
            otherCostName: typeof (value) === "string" ? value : value.
              otherCostName,
            otherCostDescription: null,
            otherCostAmount: 0,
            organizationId: 0
          } ]
      }
      return filteredValue;
    }
  }

  onTabChanged($event) {
    this.currentIndex = $event.index;

  }

  get taxCurrentIndex() {
    return this.taxCostForm.get('taxInfo')[ 'controls' ].length
      ? this.taxCostForm.get('taxInfo')[ 'controls' ].length - 1 : 0
  }

  get taxOtherCurrentIndex() {
    return this.taxCostForm.get('otherCostInfo')[ 'controls' ].length
      ? this.taxCostForm.get('otherCostInfo')[ 'controls' ].length - 1 : 0
  }


  get otherCurrentIndex() {
    return this.otherCostForm.get('otherCostInfo')[ 'controls' ].length
      ? this.otherCostForm.get('otherCostInfo')[ 'controls' ].length - 1 : 0;
  }


  alreadyPresentTax() {
    let currentTaxName: string
    if (this.taxCurrentIndex) {
      let val = (<FormGroup>(<FormArray>this.taxCostForm.get('taxInfo')).controls[ this.taxCurrentIndex ]).value[ 'taxName' ];
      currentTaxName = typeof val === 'string' ? val : val[ 'taxName' ]
    }
    else {
      currentTaxName = ''
    }
    let alreadyPresent = this.taxCurrentIndex == 0 ? false : (this.taxCostForm.get("taxInfo").value.some((val, i) => {
      let taxName = typeof val.taxName === 'string' ? val.taxName : val.taxName.taxName
      return (i !== this.taxCurrentIndex && taxName.toLowerCase() === currentTaxName.toLowerCase())
    }))
    return alreadyPresent;
  }

  alreadyPresentOtherCost() {
    let currentCostName: string
    this.taxOtherCurrentIndex ? (<FormGroup>(<FormArray>this.taxCostForm.get('otherCostInfo')).controls[ this.taxOtherCurrentIndex ]).value[ 'otherCostName' ][ 'otherCostName' ] : '';
    if (this.taxOtherCurrentIndex) {
      let val = (<FormGroup>(<FormArray>this.taxCostForm.get('otherCostInfo')).controls[ this.taxOtherCurrentIndex ]).value[ 'otherCostName' ];
      currentCostName = typeof val === 'string' ? val : val[ 'otherCostName' ]
    }
    else {
      currentCostName = ''
    }
    let alreadyPresent = this.taxOtherCurrentIndex == 0 ? false : (this.taxCostForm.get("otherCostInfo").value.some((val, i) => {
      let costName = typeof val.otherCostName === 'string' ? val.otherCostName : val.otherCostName.otherCostName
      return (i !== this.taxOtherCurrentIndex && costName.toLowerCase() === currentCostName.toLowerCase())
    }))
    return alreadyPresent;
  }

  alreadyPresentAdditionalCost() {
    let currentCostName: string
    if (this.otherCurrentIndex) {
      let val = (<FormGroup>(<FormArray>this.otherCostForm.get('otherCostInfo')).controls[ this.otherCurrentIndex ]).value[ 'otherCostName' ];
      currentCostName = typeof val === 'string' ? val : val[ 'otherCostName' ]
    }
    else {
      currentCostName = ''
    }
    // let currentCostName = this.otherCurrentIndex ? (<FormGroup>(<FormArray>this.otherCostForm.get('otherCostInfo')).controls[this.otherCurrentIndex]).value['otherCostName']['otherCostName'] : '';
    let alreadyPresent = this.otherCurrentIndex == 0 ? false : (this.otherCostForm.get("otherCostInfo").value.some((val, i) => {
      let costName = typeof val.otherCostName === 'string' ? val.otherCostName : val.otherCostName.otherCostName;
      return (i !== this.otherCurrentIndex && costName.toLowerCase() === currentCostName.toLowerCase())
    }))
    return alreadyPresent;
  }

  addNewTaxField() {
    let len = this.taxCostForm.get('taxInfo')[ 'controls' ].length;
    if (this.checkValidation || len < 1) {
      if (!this.alreadyPresentTax()) {
        (<FormArray>this.taxCostForm.get('taxInfo')).push(this.addtaxesFormGroup());
        this.filterOptionsTax = null;
      }
      else {
        this.snackbar("Tax Name Already Added");
      }
    }
  }

  addNewOtherField() {
    let len = this.data.type === 'taxesAndCost' ? this.taxCostForm.get('otherCostInfo')[ 'controls' ].length
      : this.otherCostForm.get('otherCostInfo')[ 'controls' ].length;

    if (this.data.type === 'taxesAndCost') {
      if (this.checkValidation || len < 1) {
        if (!this.alreadyPresentOtherCost()) {
          (<FormArray>this.taxCostForm.get('otherCostInfo')).push(this.addOtherCostPercentFormGroup());
          this.filterOptionsOther = null;
        }
        else {
          this.snackbar("Cost Name Already Addded");
        }
      }
    }
    if (this.data.type === 'otherCost') {
      if (this.checkValidationOther || len < 1) {
        if (!this.alreadyPresentAdditionalCost()) {
          (<FormArray>this.otherCostForm.get('otherCostInfo')).push(this.addOtherCostFormGroup());
          this.filterOptionsOther = null;
        }
        else {
          this.snackbar("Cost Name Already Addded");
        }
      }
    }
  }


  displayFn(option: TaxInfo) {
    return option && option.taxName ? option.taxName : ''
  }

  displayFnOther(option: OtherCostInfo) {
    return option && option.otherCostName ? option.otherCostName : ''
  }

  get checkValidation() {
    let validation: boolean
    if (this.currentIndex === 0) {
      validation = this.taxCostForm.get('taxInfo').valid;
    }
    else {
      validation = this.taxCostForm.get('otherCostInfo').valid;
    }
    return validation
  }

  get checkValidationOther() {
    let validation: boolean

    validation = this.otherCostForm.get('otherCostInfo').valid;

    return validation
  }

  close() {
    const checkdata = this.checkIfHaveDataAlready();
    this.dialogRef.close(checkdata);
  }

  checkIfHaveDataAlready() {
    let result;
    if (this.data.type === 'taxesAndCost') {
      if ((this.data.prevData && this.data.prevData[ 'dt' ] && Object.keys(this.data.prevData.dt).length) && (this.data.prevData.dt[ this.data.prevData.pId ] && this.data.prevData.dt[ this.data.prevData.pId ][ this.data.prevData.mId ])) {
        result = this.data.prevData.dt[ this.data.prevData.pId ][ this.data.prevData.mId ];
      }
    }
    if (this.data.type === 'otherCost') {
      if (this.data.prevData && this.data.prevData[ 'dt' ] && Object.keys(this.data.prevData.dt).length) {
        result = this.data.prevData.dt;
      }
    }
    if (!result) {
      result = null;
    }
    return result;
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
    let data = {
      organizationId: 0,
      rfqId: this.rfqId,
      taxInfo: [],
      otherCostInfo: []
    }
    if (this.taxCostForm.value.taxInfo.length) {
      this.taxCostForm.value.taxInfo.forEach(itm => {
        if (itm.taxName && itm.taxValue) {
          let taxItm: TaxInfo
          if (typeof itm.taxName === 'string') {
            taxItm = {
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
            }
          }
          else { taxItm = { ...itm.taxName, taxValue: itm.taxValue } as TaxInfo; }
          data.taxInfo.push(taxItm);
        }
      });
      this.taxCostForm.value.otherCostInfo.forEach(itm => {
        if (itm.otherCostName && itm.otherCostAmount) {
          let otItm: OtherCostInfo
          if (typeof itm.otherCostName === 'string') {
            otItm = {
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
              organizationId: 0
            }
          }
          else {
            otItm = { ...itm.otherCostName, otherCostAmount: itm.otherCostAmount } as OtherCostInfo;
          }

          data.otherCostInfo.push(otItm);
        }
      });
    }
    let check = this.currentIndex ? this.alreadyPresentOtherCost() : this.alreadyPresentTax();
    if (this.data.po) {
      if (!check) {
        this.taxcostService.poTaxCostData(data)
          .then(res => {
            this.dialogRef.close(res.data);
          });
      }
      else {
        this.currentIndex ? this.snackbar("Cost Name Already Added") : this.snackbar("Tax Name Already Added");
      }
    } else {
      if (!check) {
        this.taxcostService.postTaxCostData(data)
          .then(res => {
            this.dialogRef.close(res.data);
          });
      }
      else {
        this.currentIndex ? this.snackbar("Cost Name Already Added") : this.snackbar("Tax Name Already Added");
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
          let otItm: OtherCostInfo
          if (typeof itm.otherCostName === 'string') {
            otItm = {
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
              organizationId: 0
            }
          }
          else {
            otItm = { ...itm.otherCostName, otherCostAmount: itm.otherCostAmount } as OtherCostInfo;
          }
          data.otherCostInfo.push(otItm);
        }
      });
      let check = this.alreadyPresentAdditionalCost();
      if (this.data.po) {
        if (!check) {
          this.taxcostService.poTaxCostData(data)
            .then(res => {
              this.dialogRef.close(res.data);
            });
        }
        else {
          this.snackbar("Cost Name Already Added")
        }
      }
      else {
        if (!check) {
          this.taxcostService.postTaxCostData(data)
            .then(res => {
              this.dialogRef.close(res.data);
            });
        }
        else {
          this.snackbar("Cost Name Already Added")
        }
      }
    }
  }

  snackbar(msg) {
    this._snackBar.open(msg, "", {
      duration: 4000,
      panelClass: [ "warning-snackbar" ],
      verticalPosition: "bottom"
    });
  }

}
