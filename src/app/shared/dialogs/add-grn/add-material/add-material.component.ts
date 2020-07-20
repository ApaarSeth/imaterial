import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TaxInfo } from 'src/app/shared/models/tax-cost.model';
import { Observable } from 'rxjs';
import { BomService } from 'src/app/shared/services/bom/bom.service';
import { ActivatedRoute } from '@angular/router';
import { Subcategory } from 'src/app/shared/models/subcategory-materials';
import { MatRadioButton, MatSnackBar, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { Currency } from 'src/app/shared/models/currency';
import { GrnFormMaterialList, GrnMaterialList } from 'src/app/shared/models/add-direct-grn';

@Component({
    selector: 'app-add-material',
    templateUrl: 'add-material.component.html'
})

export class GrnAddMaterialComponent implements OnInit {
    filterMaterialName: Observable<Subcategory[]>
    filteredMaterialName: Subcategory[]
    addMaterialsForm: FormGroup;
    orgId: number
    projectId: number
    materialUnit: string[]
    currency: string
    alreadyPresent: boolean = false;
    constructor(private _snackbar: MatSnackBar, private route: ActivatedRoute,
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
        const frmGrp = this.formBuilder.group({
            materialName: ['', Validators.required],
            materialUnit: ['', Validators.required],
            deliveredQty: ['', Validators.required],
            index: [],
            pendingQty: ['', Validators.required],
            materialUnitPrice: ['', Validators.required],
            amount: ['', Validators.required]
        });

        frmGrp.get("index").patchValue(this.addMaterialsForm.get('addMaterial')['controls'].length)
        frmGrp.controls['materialName'].valueChanges.subscribe(changes => {
            this.filterMaterialName = null;
            const val: Subcategory[] = this._namefilter(typeof changes === 'string' ? changes.toLowerCase() : changes)
            this.filterMaterialName = new Observable((observer) => {
                observer.next(val);
                observer.complete();
            })
            if (typeof changes === 'object') {
                <FormArray>this.addMaterialsForm.get('addMaterial')['controls'][frmGrp.get("index").value].patchValue({ materialUnit: (<Subcategory>changes).materialUnit });
                <FormArray>this.addMaterialsForm.get('addMaterial')['controls'][frmGrp.get("index").value].patchValue({ pendingQty: (<Subcategory>changes).estimatedQty - (<Subcategory>changes).availableStock });
                <FormArray>this.addMaterialsForm.get('addMaterial')['controls'][frmGrp.get("index").value].controls['pendingQty'].disable();
                if (<FormArray>this.addMaterialsForm.get('addMaterial')['controls'][frmGrp.get("index").value].controls['materialUnit'].value.length) {
                    <FormArray>this.addMaterialsForm.get('addMaterial')['controls'][frmGrp.get("index").value].controls['materialUnit'].disable();
                }
            }
            else {
                <FormArray>this.addMaterialsForm.get('addMaterial')['controls'][frmGrp.get("index").value].patchValue({ pendingQty: 0 });
                <FormArray>this.addMaterialsForm.get('addMaterial')['controls'][frmGrp.get("index").value].controls['pendingQty'].disable();
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

    onSubmitMaterials() {
        if (!this.alreadyPresentMaterial()) {
            this.stepper.next()
        } else {
            this.snackbar("Material Name Already Added");
            (<FormGroup>(<FormArray>this.addMaterialsForm.get('addMaterial')).controls[this.addMaterialCurrentIndex]).controls['materialName'].reset()
        }
    }

    getMaterialList() {
        return this.addMaterialsForm.value.addMaterial.map((mat: GrnFormMaterialList) => {
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