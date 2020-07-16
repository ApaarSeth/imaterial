import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { AngularEditor } from 'src/app/shared/constants/angular-editor.constant';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { CountryCode } from 'src/app/shared/models/currency';
import { SuppliersDialogComponent } from '../../add-supplier/suppliers-dialog.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DocumentList } from 'src/app/shared/models/PO/po-data';
import { DocumentUploadService } from 'src/app/shared/services/document-download/document-download.service';

@Component({
    selector: 'app-add-supplier',
    templateUrl: 'add-supplier.component.html'
})

export class GrnAddSupplierComponent implements OnInit {
    @Input("countryList") cntryList: CountryCode[]
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

    constructor(
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private documentUploadService: DocumentUploadService
    ) { }


    ngOnInit() {
        this.countryList = this.cntryList;
        this.initForm();
        this.cntryId = Number(localStorage.getItem('countryId'));
        this.getCountryCode();
    }

    initForm() {
        this.form = this.formBuilder.group({
            grnNo: [''],
            grnDate: [''],
            supplierName: ["", Validators.required],
            email: ["", [Validators.required, Validators.pattern(FieldRegExConst.EMAIL)]],
            contact_no: [null, [Validators.pattern(FieldRegExConst.MOBILE3)]],
            countryCode: [],
            textArea: []
        })
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

}