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
import { AppNotificationService } from 'src/app/shared/services/app-notification.service';

@Component({
    selector: 'app-add-supplier',
    templateUrl: 'add-supplier.component.html'
})

export class GrnAddSupplierComponent implements OnInit {
    @Input("countryList") cntryList: CountryCode[];
    @Input("supplierList") supplrList: Supplier[];
    @Input("materialList") materialList: GrnMaterialList[];
    @Input("projectId") prjctId: number
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
    projectId: number
    constructor(
        private notifier: AppNotificationService,
        private commonService: CommonService,
        private bomService: BomService,
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private documentUploadService: DocumentUploadService,
        private dialogRef: MatDialogRef<GrnAddSupplierComponent>
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
        if (changes.prjctId && changes.prjctId.currentValue) {
            this.projectId = changes.prjctId.currentValue
        }
    }
    initForm() {
        this.form = this.formBuilder.group({
            grnNo: ['', Validators.maxLength(300)],
            grnDate: ['', Validators.required],
            supplierName: ["", [Validators.required, Validators.maxLength(300)]],
            email: ["", [Validators.required, Validators.pattern(FieldRegExConst.EMAIL), Validators.maxLength(300)]],
            contact: [null, [Validators.pattern(FieldRegExConst.MOBILE3), , Validators.maxLength(300)]],
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
            if (typeof changes === 'object') {
                this.form.patchValue({ email: (<Supplier>changes).email });
                this.form.patchValue({ contact: (<Supplier>changes).phoneNo });
                let supplierCountry = this.countryList.filter((cntry: CountryCode) => {
                    return cntry.callingCode === (<Supplier>changes).countryCallingCode
                })
                this.form.patchValue({ countryCode: supplierCountry[0] });
                this.form.patchValue({ email: (<Supplier>changes).email });
                this.form.get('email').disable();
                this.form.get('contact').disable();
                this.form.get('countryCode').disable();
            }
            else {
                this.form.get('email').enable();
                this.form.get('contact').enable();
                this.form.get('countryCode').enable();

                this.form.get('email').reset();
                this.form.get('contact').reset();
                this.form.get('countryCode').reset();
                this.getCountryCode()
            }
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
        let { countryCode, grnDate, supplierName } = this.form.getRawValue()
        countryCode = countryCode ? countryCode.callingCode : null
        let materialList = this.materialList
        let documentList = this.documentList
        let supplierId = typeof (this.form.value.supplierName) === 'object' ? Number(this.form.value.supplierName.supplierId) : null;
        supplierName = typeof (this.form.value.supplierName) === 'object' ? this.form.value.supplierName.supplier_name : this.form.value.supplierName;
        if (grnDate) {
            grnDate = this.commonService.getFormatedDate(grnDate)
        }
        let data = { ...this.form.getRawValue(), grnDate, supplierName, supplierId, materialList, documentList, countryCode, projectId: Number(this.projectId) }
        this.bomService.addGrnWithoutPo(data).then(res => {
            if (res.statusCode === 200) {
                this.notifier.snack("GRN Created Successfully!")
                this.dialogRef.close(null)
            }
            else {
                this.notifier.snack("There is some issue submitting GRN")
            }
        })
    }
}