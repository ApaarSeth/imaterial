import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { TaxInfo } from 'src/app/shared/models/tax-cost.model';
import { Observable } from 'rxjs';
import { BomService } from 'src/app/shared/services/bom/bom.service';
import { ActivatedRoute } from '@angular/router';
import { Subcategory } from 'src/app/shared/models/subcategory-materials';
import { MatRadioButton, MatSnackBar, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { Currency } from 'src/app/shared/models/currency';
import { GrnFormMaterialList, GrnMaterialList } from 'src/app/shared/models/add-direct-grn';
import { AppNotificationService } from 'src/app/shared/services/app-notification.service';

@Component({
    selector: 'app-add-material',
    templateUrl: 'add-material.component.html'
})

export class GrnAddMaterialComponent implements OnInit {
    filterMaterialName: Observable<Subcategory[]>
    filteredMaterialName: Subcategory[]
    addMaterialsForm: FormGroup;
    orgId: number
    searchUnit: string = ''
    projectId: number
    materialUnit: string[]
    currency: string
    alreadyPresent: boolean = false;
    constructor(private _snackbar: MatSnackBar, private route: ActivatedRoute,
        private notifier: AppNotificationService,
        private bomService: BomService,
        private formBuilder: FormBuilder,
        private stepper: MatStepper,
        @Inject(MAT_DIALOG_DATA) public data) { }

    ngOnInit() {
        this.currency = localStorage.getItem('currencyCode')
        this.orgId = Number(localStorage.getItem('orgId'))
        this.projectId = this.data
        this.bomService.getMaterialWithQuantity(this.orgId, this.projectId).then(res => {
            this.filteredMaterialName = res.data ? [...res.data] : null;
        });
        this.FormInit()
        this.getMaterialUnit()
    }


    FormInit() {
        this.addMaterialsForm = this.formBuilder.group({
            addMaterial: this.formBuilder.array([]),
        });
        (<FormArray>this.addMaterialsForm.get('addMaterial')).push(this.addMaterialFormGroup());
    }

    getMaterialUnit() {
        this.bomService.getMaterialUnit().then(res => {
            this.materialUnit = res.data;
        });
    }


    addMaterialFormGroup() {
        let frmGrp = this.formBuilder.group({
            materialName: ['', [Validators.required, Validators.maxLength(300)]],
            materialUnit: ['', [Validators.required, Validators.maxLength(300)]],
            deliveredQty: ['', [Validators.required, Validators.maxLength(300)]],
            index: [],
            pendingQty: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(300)]],
            materialUnitPrice: ['', [Validators.required, Validators.maxLength(300)]],
            amount: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(300)]]
        });

        frmGrp.get("index").patchValue(this.addMaterialsForm.get('addMaterial')['controls'].length)
        frmGrp.controls['materialName'].valueChanges.subscribe(changes => {
            this.filterMaterialName = null;
            const val: Subcategory[] = this._namefilter(typeof changes === 'string' ? changes.toLowerCase() : changes)
            this.filterMaterialName = new Observable((observer) => {
                observer.next(val);
                observer.complete();
            })
            let index = frmGrp.get("index").value
            let matGroup: FormGroup = null;
            (<FormArray>this.addMaterialsForm.get('addMaterial'))['controls'].forEach((frmgrp: FormGroup) => {
                if (frmGrp.value.index === index) {
                    matGroup = frmgrp
                }
            }) as any
            if (changes && typeof changes === 'object') {
                matGroup.patchValue({ materialUnit: (<Subcategory>changes).materialUnit });
                matGroup.patchValue({ pendingQty: (<Subcategory>changes).estimatedQty - (<Subcategory>changes).availableStock });
                matGroup.get('deliveredQty').setValidators([matGroup.get('deliveredQty').validator, this.quantityCheck(changes)])
                matGroup.controls['pendingQty'].disable();
                if (matGroup.controls['materialUnit'].value.length) {
                    matGroup.controls['materialUnit'].disable();
                }
            }
            else {
                matGroup.get('deliveredQty').setValidators([Validators.required, Validators.maxLength(300)])
                matGroup.controls['pendingQty'].enable();
                matGroup.patchValue({ pendingQty: 0 });
                matGroup.controls['pendingQty'].disable();
                matGroup.controls['materialUnit'].enable();;
                matGroup.controls['materialUnit'].reset();

            }
        })
        frmGrp.controls['materialUnitPrice'].valueChanges.subscribe(changes => {
            let index = frmGrp.get("index").value
            let matGroup: FormGroup = null;
            (<FormArray>this.addMaterialsForm.get('addMaterial'))['controls'].forEach((frmgrp: FormGroup) => {
                if (frmGrp.value.index === index) {
                    matGroup = frmgrp
                }
            }) as any
            if (typeof changes === 'string') {
                let deliveredQty = matGroup.value['deliveredQty'] as number;
                matGroup.get('amount').enable();
                matGroup.patchValue({ amount: Number(changes) * (deliveredQty ? deliveredQty : 0) });
                matGroup.get('amount').disable();

            }
        })
        frmGrp.controls['deliveredQty'].valueChanges.subscribe(changes => {
            let index = frmGrp.get("index").value
            let matGroup: FormGroup = null;
            (<FormArray>this.addMaterialsForm.get('addMaterial'))['controls'].forEach((frmgrp: FormGroup) => {
                if (frmGrp.value.index === index) {
                    matGroup = frmgrp
                }
            }) as any
            if (typeof changes === 'string') {
                let materialUnitPrice = matGroup.value['materialUnitPrice'] as number;
                matGroup.patchValue({ amount: Number(changes) * (materialUnitPrice ? materialUnitPrice : 0) });
            }
        })
        return frmGrp;
    }

    private _namefilter(value: string): Subcategory[] {
        if (value === '') {
            return this.filteredMaterialName;
        }
        let filteredValue: Subcategory[] = !this.filteredMaterialName ? [] : this.filteredMaterialName.filter(option => option.materialName.toLowerCase().includes(value));
        return filteredValue;

    }

    quantityCheck(changes): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            let checkValue = (<Subcategory>changes).estimatedQty - (<Subcategory>changes).availableStock
            if (checkValue < control.value) {
                this.notifier.snack("Cannot add quantity greater than " + checkValue);
                control.setValue(0)
                return { 'quanityExceed': true };
            }
            return null;
        }
    }

    onSubmitMaterials() {
        if (!this.alreadyPresentMaterial()) {
            this.stepper.next()
        } else {
            this.snackbar("Material Name Already Added");
            (<FormGroup>(<FormArray>this.addMaterialsForm.get('addMaterial')).controls[this.addMaterialCurrentIndex]).controls['materialName'].reset()
        }
    }

    getMaterialList() {
        return this.addMaterialsForm.getRawValue().addMaterial.map((mat: GrnFormMaterialList) => {
            return {
                materialName: typeof mat.materialName === 'object' ? mat.materialName.materialName : mat.materialName,
                materialId: typeof mat.materialName === 'object' ? mat.materialName.materialId : null,
                materialUnit: mat.materialUnit,
                deliveredQty: Number(mat.deliveredQty),
                materialUnitPrice: Number(mat.materialUnitPrice),
                amount: Number(mat.amount)
            } as GrnMaterialList
        })
    }


    deleteField(index) {
        (<FormArray>this.addMaterialsForm.get('addMaterial')).removeAt(index);
    }

    displayFn(option: Subcategory) {
        return option && option.materialName ? option.materialName : ''
    }

    addNewMaterialField() {
        if (this.addMaterialsForm.get('addMaterial')['controls'][this.addMaterialCurrentIndex].valid) {
            if (!this.alreadyPresentMaterial()) {
                (<FormArray>this.addMaterialsForm.get('addMaterial')).push(this.addMaterialFormGroup());
                this.filterMaterialName = null;
            }
            else {
                this.snackbar("Material Name Already Added");
            }
        }
    }
    get addMaterialCurrentIndex() {
        return this.addMaterialsForm.get('addMaterial')['controls'].length
            ? this.addMaterialsForm.get('addMaterial')['controls'].length - 1 : 0
    }




    alreadyPresentMaterial() {
        let currentMaterialName: string
        if (this.addMaterialCurrentIndex) {
            let val = (<FormGroup>(<FormArray>this.addMaterialsForm.get('addMaterial')).controls[this.addMaterialCurrentIndex]).value['materialName'];
            currentMaterialName = typeof val === 'string' ? val : val['materialName']
        }
        else {
            currentMaterialName = ''
        }
        let alreadyPresent = this.addMaterialCurrentIndex == 0 ? false : (this.addMaterialsForm.get("addMaterial").value.some((val, i) => {
            let materialName = typeof val.materialName === 'string' ? val.materialName : val.materialName.materialName
            return (i !== this.addMaterialCurrentIndex && materialName.toLowerCase() === currentMaterialName.toLowerCase())
        }))
        return alreadyPresent;
    }


    snackbar(msg) {
        this._snackbar.open(msg, "", {
            duration: 4000,
            panelClass: ["warning-snackbar"],
            verticalPosition: "bottom"
        });
    }

}