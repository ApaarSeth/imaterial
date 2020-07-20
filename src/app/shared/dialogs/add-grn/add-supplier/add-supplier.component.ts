import { Component, OnInit, Inject, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { AngularEditor } from 'src/app/shared/constants/angular-editor.constant';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CountryCode } from 'src/app/shared/models/currency';
import { SuppliersDialogComponent } from '../../add-supplier/suppliers-dialog.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DocumentList } from 'src/app/shared/models/PO/po-data';
import { DocumentUploadService } from 'src/app/shared/services/document-download/document-download.service';
import { GrnMaterialList } from 'src/app/shared/models/add-direct-grn';
import { BomService } from 'src/app/shared/services/bom/bom.service';
import { Supplier } from 'src/app/shared/models/RFQ/rfq-view';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/shared/services/commonService';

@Component({
    selector: 'app-add-supplier',
    templateUrl: 'add-supplier.component.html'
})

export class GrnAddSupplierComponent implements OnInit {
    @Input("countryList") cntryList: CountryCode[];
    @Input("supplierList") supplrList: Supplier[];
    @Input("materialList") materialList: GrnMaterialList[];

    filterSupplierName: Observable<Supplier[]>;
    searchCountry = "";
    countryList: CountryCode[] = [];
    form: FormGroup;
    documentsName: string[] = [];
    livingCountry: CountryCode[] = [];
    cntryId: number;
    docs: FileList;
    filesRemoved: boolean;
    documentList: DocumentList[] = [];
    config: AngularEditorConfig = AngularEditor.config;
    supplierList: Supplier[] = []
    isMobile: boolean
    constructor(
        private commonService: CommonService,
        private bomService: BomService,
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private documentUploadService: DocumentUploadService
    ) { }


    ngOnInit() {
        this.initForm();
        this.isMobile = this.commonService.isMobile().matches;
        this.cntryId = Number(localStorage.getItem('countryId'));
        this.getCountryCode();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.cntryList && changes.cntryList.currentValue) {
            this.countryList = this.cntryList;
        }
        if (changes.supplrList && changes.supplrList.currentValue) {
            this.supplierList = this.supplrList
        }
    }
    initForm() {
        this.form = this.formBuilder.group({
            grnNo: [''],
            grnDate: [''],
            supplierName: ["", Validators.required],
            email: ["", [Validators.required, Validators.pattern(FieldRegExConst.EMAIL)]],
            contact: [null, [Validators.pattern(FieldRegExConst.MOBILE3)]],
            countryCode: [],
            comments: []
        })

        this.form.controls['supplierName'].valueChanges.subscribe(changes => {
            this.filterSupplierName = null;
            const val: Supplier[] = this._namefilter(typeof changes === 'string' ? changes.toLowerCase() : changes)
            this.filterSupplierName = new Observable((observer) => {
                observer.next(val);
                observer.complete();
            })
            // if (typeof changes === 'object') {
            //     this.form.get("index").value].patchValue({ materialUnit: (<Subcategory>changes).materialUnit });
            //     this.form.get("index").value].patchValue({ pendingQty: (<Subcategory>changes).estimatedQty - (<Subcategory>changes).availableStock });
            //     this.form.get("index").value].controls['pendingQty'].disable();
            //     if (<FormArray>this.addMaterialsForm.get('addMaterial')['controls'][form.get("index").value].controls['materialUnit'].value.length) {
            //         <FormArray>this.addMaterialsForm.get('addMaterial')['controls'][form.get("index").value].controls['materialUnit'].disable();
            //     }
            // }
            // else {
            //     <FormArray>this.addMaterialsForm.get('addMaterial')['controls'][frmGrp.get("index").value].patchValue({ pendingQty: 0 });
            //     <FormArray>this.addMaterialsForm.get('addMaterial')['controls'][frmGrp.get("index").value].controls['pendingQty'].disable();
            // }
        })
    }

    private _namefilter(value: string): Supplier[] {
        if (value === '') {
            return this.supplierList;
        }
        let filteredValue: Supplier[] = !this.supplierList ? [] : this.supplierList.filter(option => option.supplier_name.toLowerCase().includes(value));
        return filteredValue;

    }

    get selectedCountry() {
        return this.form.get('countryCode').value;
    }

    getCountryCode() {
        this.livingCountry = this.countryList.filter(val => {
            return val.countryId === Number(this.cntryId);
        })
        this.form.get('countryCode').setValue(this.livingCountry[0])
    }

    displayFn(option: Supplier) {
        return option && option.supplier_name ? option.supplier_name : ''
    }

    fileUpdate(files: FileList) {
        // this.urlReceived = false;
        this.docs = files;
        this.uploadDocs();
    }

    uploadDocs() {
        if (this.docs && this.docs.length) {
            const data = new FormData();
            const fileArr: File[] = [];
            data.append(`file`, this.docs[0]);
            if (!(this.documentList.some(element => {
                return element.documentName == this.docs[0].name;
            }))) {
                return this.documentUploadService.postDocumentUpload(data).then(res => {
                    this.filesRemoved = false;
                    let name: string = res.data;
                    let firstName: number = res.data.fileName.indexOf("_");
                    let subFileName = res.data.fileName.substring(firstName + 1, res.data.fileName.length);
                    this.documentsName.push(subFileName);
                    this.documentList.push({
                        documentType: "PO",
                        DocumentDesc: subFileName,
                        DocumentUrl: res.data.fileName,
                        documentName: subFileName,
                        Url: res.data.url
                    });
                    subFileName = "";
                    this.filesRemoved = true;

                    this._snackBar.open("File has been successfully uploaded", "", {
                        duration: 2000,
                        panelClass: ["success-snackbar"],
                        verticalPosition: "bottom"
                    });

                }).catch(err => {
                    this.filesRemoved = true;
                    this.docs = null;
                    this._snackBar.open(
                        err.error.message,
                        "",
                        {
                            duration: 4000,
                            panelClass: ["warning-snackbar"],
                            verticalPosition: "bottom"
                        }
                    );
                });
            }
            else {
                this._snackBar.open(
                    'Duplicate files are not allowed',
                    "",
                    {
                        duration: 4000,
                        panelClass: ["warning-snackbar"],
                        verticalPosition: "bottom"
                    }
                );
            }
        }
    }

    removeFile(i) {
        this.documentList.splice(i, 1);
        this.documentsName.splice(i, 1);
        this.filesRemoved = true;
    }

    onSubmit() {
        this.form.value.countryCode = this.form.value.countryCode ? this.form.value.countryCode.callingCode : null
        this.form.value.materialList = this.materialList
        this.form.value.documentList = this.documentList
        this.form.value.supplierId = typeof (this.form.value.supplierName === 'object') ? Number(this.form.value.supplierName.supplier_name) : null;
        this.form.value.supplierName = typeof (this.form.value.supplierName === 'object') ? this.form.value.supplierName.supplier_name : this.form.value.supplierName;
        if (this.form.value.grnDate) {
            this.form.value.grnDate = this.commonService.getFormatedDate(this.form.value.grnDate)
        }
        this.bomService.addGrnWithoutPo(this.form.value).then(res => {
            console.log(res)
        })
    }
}