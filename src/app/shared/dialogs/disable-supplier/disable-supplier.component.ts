import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserService } from '../../services/userDashboard/user.service';
import { Router } from '@angular/router';
import { RFQService } from '../../services/rfq/rfq.service';
import { Suppliers } from '../../models/RFQ/suppliers';
import { AllSupplierDetails, SupplierAdd, SupplierDetailsPopUpData } from '../../models/supplier';

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
  selector: "disable-supplier-dialog",
  templateUrl: "disable-supplier-component.html"
})
export class DeactiveSupplierComponent implements OnInit {
  supplierDetails: SupplierAdd;

  constructor(
    private dialogRef: MatDialogRef<DeactiveSupplierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SupplierDetailsPopUpData,
    private formBuilder: FormBuilder,
    private router: Router,
    private rfqService: RFQService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() { }

  deactivateSupplierService() {
    this.supplierDetails = this.data.isDelete
      ? this.data.detail as SupplierAdd
      : ({} as SupplierAdd);

    if (this.data.isDelete) {
      this.rfqService.deleteSuplier(this.supplierDetails.supplierId).then(data => {
        if (data) {
          this.dialogRef.close(data.message);
          this._snackBar.open(data.message, "", {
            duration: 2000,
            panelClass: ["success-snackbar"],
            verticalPosition: "bottom"
          });
        }
        return data.data;
        debugger
      });
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  deactivateSupplier() {
    this.deactivateSupplierService();
  }
}