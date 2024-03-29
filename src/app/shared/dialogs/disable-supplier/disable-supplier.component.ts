import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,

} from "@angular/forms";

import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SupplierAdd, SupplierDetailsPopUpData } from "../../models/supplier";
import { RFQService } from "../../services/rfq.service";

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