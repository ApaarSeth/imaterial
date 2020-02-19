import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AllUserDetails, UserDetailsPopUpData } from '../../models/user-details';
import { UserService } from '../../services/userDashboard/user.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BomService } from '../../services/bom/bom.service';
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
    
        let poId:number = this.data.pID;
        let orgId=Number(localStorage.getItem("orgId"));
         this.grnService.viewGRN(orgId, poId).then(res =>{
           this.dataSource =  res.data;
            this.formsInit();
           });
       this.purchaseOrderId = this.data.pID;
       
          
    }
      formsInit() {
        this.GRNDetails = this.data.isEdit
        ? this.data.detail
        : ({} as GRNDetails);

           this.orgId=Number(localStorage.getItem("orgId"));
             const frmArr = this.dataSource.map(data => {
                return new FormGroup({
                    materialName: new FormControl(this.data.detail.materialName),
                    materialBrand: new FormControl(this.data.detail.materialName),
                    certifiedQty: new FormControl(this.data.detail.certifiedQty?this.data.detail.certifiedQty : ""),
                    materialId: new FormControl(this.data.detail.materialId),
                    deliveredQty: new FormControl(this.data.detail.deliveredQty),
                    awardedQty: new FormControl(this.data.detail.awardedQty),
                    deliveredDate: new FormControl(this.data.detail.deliveredDate),
                    grnId: new FormControl(this.data.detail.grnId),
                    grnDetailId: new FormControl(this.data.detail.grnDetailId),
                    purchaseOrderId: new FormControl(this.data.pID),
                    organizationId: new FormControl(this.orgId)
                });
                });
            this.materialForms = this.formBuilder.group({
            forms: new FormArray(frmArr)
            });
              console.log("Materials---");
            console.log(this.materialForms);
  }

    postGRNDetails(grnDetailsObj:GRNDetails[]) {
        this.grnService.addGRN(grnDetailsObj).then(data => {
           this.snack.open(data.message, '', { duration: 2000 , panelClass: ['blue-snackbar']});
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
        const formValues: GRNDetails[] = [];
            this.materialForms.value.forms.forEach(element => {
            if(element.certifiedQty > 0){
            formValues.push(element);
            }
            });
        this.postGRNDetails(formValues);
  }
   closeDialog(){
    this.dialogRef.close();
  }

}
