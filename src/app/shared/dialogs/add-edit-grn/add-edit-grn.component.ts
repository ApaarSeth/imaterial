import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators
} from "@angular/forms";
import { GRNService } from '../../services/grn/grn.service';
import { GRNDetails, GRNPopupData } from '../../models/grn';

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
  grnDetails: GRNDetails;
  grnId: number;
  dataSource: GRNDetails[];
  GRNDetails: GRNDetails;

  displayedColumns: string[] = [
    "Material Name",
    "Brand Name",
    "Awarded Quantity",
    "Delivered Quantity",
    "Certified Quantity"
  ];
  materialForms: FormGroup;
  orgId: number;
  purchaseOrderId: any;

  constructor(private grnService: GRNService,
    private dialogRef: MatDialogRef<AddEditGrnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GRNPopupData,
    private formBuilder: FormBuilder, private snack: MatSnackBar) { }

  ngOnInit() {
    let poId: number = this.data.pID;
    let orgId = Number(localStorage.getItem("orgId"));
    this.grnService.viewGRN(orgId, poId).then(res => {
      this.dataSource = res.data;
      this.formsInit();
    });
    this.purchaseOrderId = this.data.pID;
  }


  formsInit() {
    this.GRNDetails = this.data.isEdit
      ? this.data.detail
      : ({} as GRNDetails);

    this.orgId = Number(localStorage.getItem("orgId"));

    const frmArr = this.dataSource.map(data => {
      return new FormGroup({
        materialName: new FormControl(data.materialName),
        materialBrand: new FormControl(data.materialBrand),
        certifiedQty: new FormControl(data.certifiedQty ? data.certifiedQty : "", {
          validators:
            [
              Validators.required,
              Validators.max(data.materialQuantity),
              Validators.min(1)
            ]
        }),
        materialId: new FormControl(data.materialId),
        deliveredQty: new FormControl(data.deliveredQty),
        awardedQty: new FormControl(data.awardedQty),
        deliveredDate: new FormControl(data.deliveredDate),
        grnId: new FormControl(data.grnId),
        grnDetailId: new FormControl(data.grnDetailId),
        purchaseOrderId: new FormControl(this.data.pID),
        organizationId: new FormControl(this.orgId)
      });
    });
    this.materialForms = this.formBuilder.group({
      forms: new FormArray(frmArr)
    });
  }

  postGRNDetails(grnDetailsObj: GRNDetails[]) {
    this.grnService.addGRN(grnDetailsObj).then(data => {
      this.snack.open(data.message, '', { duration: 2000, panelClass: ['blue-snackbar'] });
      this.dialogRef.close(data);
    })
  }


  // getGRNDetails(grnId: number) {
  //     this.grnService.getGRNDetails(grnId).then(data => {
  //         console.log("grn data", data.data);
  //         this.grnDetails = data.data;
  //         this.grnDetailsObj = data.data;
  //         this.formsInit(this.grnDetailsObj);

  //     });
  // }

  addGrn() {
    if (this.materialForms.valid) {
      const formValues: GRNDetails[] = [];
      this.materialForms.value.forms.forEach(element => {
        if (element.certifiedQty > 0) {
          formValues.push(element);
        }
      });
      this.postGRNDetails(formValues);
    }

  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}