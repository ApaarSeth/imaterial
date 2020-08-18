import { Component, Inject, OnInit, HostListener, ViewChild, Input } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, AbstractControl } from "@angular/forms";
import { GRNService } from "../../services/grn/grn.service";
import { GRNDetails, GRNPopupData, GRNList } from "../../models/grn";
import { AppNavigationService } from '../../services/navigation.service';
import { DocumentList } from '../../models/PO/po-data';
import { GRNDocumentsComponent } from './grn-documents/grn-documents.component';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { threadId } from "worker_threads";
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
  selector: "add-edit-grn-dialog",
  templateUrl: "add-edit-grn-component.html"
})
export class AddEditGrnComponent implements OnInit {
  @Input("documentListLength") public documentListLength: number;
  @Input("documentData") documentData: DocumentList[];
  @ViewChild("grnDocument", { static: false }) grnDocument: GRNDocumentsComponent;
  grnDetailsObj: GRNList = { GrnList: [], DocumentsList: [] };
  grnDetails: GRNDetails;
  grnId: number;
  dataSource: GRNDetails[];
  GRNDetails: GRNDetails;
  qtyEnteredValidation;
  displayedColumns: string[] = ["Material Name", "Brand Name", "Unit", "Awarded Quantity", "Delivered Quantity", "Received Quantity"];
  materialForms: FormGroup;
  orgId: number;
  purchaseOrderId: any;
  valid: boolean;
  status: boolean = false;
  showtable: boolean;
  documentList
  constructor(
    private grnService: GRNService,
    private navService: AppNavigationService,
    private dialogRef: MatDialogRef<AddEditGrnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GRNPopupData,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    let poId: number = this.data.pID;
    let orgId = Number(localStorage.getItem("orgId"));
    this.grnService.viewGRN(orgId, poId).then(res => {
      this.dataSource = res.data;
      this.formsInit();
    });
    window.dispatchEvent(new Event('resize'));

    this.purchaseOrderId = this.data.pID;
  }

  formsInit() {
    this.GRNDetails = this.data.isEdit ? this.data.detail : ({} as GRNDetails);
    this.orgId = Number(localStorage.getItem("orgId"));

    const frmArr = this.dataSource.map((data, i) => {
      const formGrp = this.formBuilder.group({
        materialName: [data.materialName],
        materialBrand: [data.materialBrand],
        certifiedQty: [data.certifiedQty ? data.certifiedQty : null, this.checkValidation(data.deliverableQty)],
        materialId: [data.materialId],
        deliveredQty: [data.deliveredQty],
        awardedQty: [data.awardedQty],
        deliveredDate: [data.deliveredDate],
        deliverableQty: [data.deliverableQty],
        grnId: [data.grnId],
        grnDetailId: [data.grnDetailId],
        purchaseOrderId: [this.data.pID],
        organizationId: [this.orgId],
        index: [i]
      });
      formGrp.get('certifiedQty').valueChanges.subscribe(val => {
        if (Number(val) > 0) {
          (<FormArray>this.materialForms.get('forms')).controls[formGrp.get('index').value].get('deliveredDate').setValidators(Validators.required)
        } else {
          (<FormArray>this.materialForms.get('forms')).controls[formGrp.get('index').value].get('deliveredDate').clearValidators()
        }
      })
      return formGrp
    });
    this.materialForms = this.formBuilder.group({
      forms: new FormArray(frmArr)
    });

    // this.materialForms.valueChanges.subscribe(val => {
    //   this.checkValidation();
    // });
  }

  postGRNDetails(formValues: GRNDetails[]) {
    this.grnDetailsObj.GrnList = formValues;
    this.grnDetailsObj.DocumentsList = this.grnDocument.getData();
    this.grnService.addGRN(this.grnDetailsObj).then(data => {

      this._snackBar.open(data.message, "", {
        duration: 2000, panelClass: ["success-snackbar"],
        verticalPosition: "bottom"
      });
      this.dialogRef.close(data);

      if (data.status == 1) {
        this.navService.gaEvent({
          action: 'submit',
          category: 'add_grn',
          label: null,
          value: null
        });
      }

    });
  }

  // getGRNDetails(grnId: number) {
  //     this.grnService.getGRNDetails(grnId).then(data => {
  //         this.grnDetails = data.data;
  //         this.grnDetailsObj = data.data;
  //         this.formsInit(this.grnDetailsObj);

  //     });
  // }

  addGrn() {
    const formValues: GRNDetails[] = [];
    this.materialForms.value.forms.forEach((element, i) => {
      element.certifiedQty = Number(element.certifiedQty)
      if (element.certifiedQty > 0) {
        delete element.index;
        formValues.push(element);
      }
    });
    this.grnDetailsObj.GrnList = formValues;
    this.postGRNDetails(formValues);
  }

  checkValidation(deliverableQty: number) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value > deliverableQty) {
        this._snackBar.open(
          "Received quantity cannot be greater than delivered qty",
          "",
          {
            duration: 2000,
            panelClass: ["warning-snackbar"],
            verticalPosition: "bottom"
          }
        );
        control.setValue(0)
        return { 'nameIsForbidden': true };
      }
      return null;
    }
  }

  valueEntered() {
    return this.materialForms.value.forms.some(element => {
      return element.certifiedQty > 0;
    });
  }

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (event.currentTarget.innerWidth >= 962) {
      this.showtable = true;
    } else {
      this.showtable = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}
