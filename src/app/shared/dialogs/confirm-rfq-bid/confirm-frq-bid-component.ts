import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AllUserDetails, UserDetailsPopUpData } from '../../models/user-details';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { POService } from '../../services/po.service';
import { RFQService } from '../../services/rfq.service';
import { AppNavigationService } from '../../services/navigation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

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
  selector: "confirm-frq-bid-",
  templateUrl: "confirm-frq-bid-component.html"
})
export class ConfirmRfqBidComponent implements OnInit {
  constructor(
    private userService: UserService,
    private poService: POService,
    private dialogRef: MatDialogRef<ConfirmRfqBidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private router: Router,
    private navService: AppNavigationService,
    private _snackBar: MatSnackBar,
    private rfqService: RFQService
  ) { }

  ngOnInit() {

  }

  cancel() {
    this.dialogRef.close({ data: 'close' });
  }

  submit() {
    if (this.data.disabledAddress) {
      this.rfqService.postRFQDetailSupplier(this.data.supplierId, this.data.rfqSupplierData).then(data => {
        if (data.status == 1) {
          this.navService.gaEvent({
            action: 'submit',
            category: 'submit_bid',
            label: null,
            value: null
          });
        }
        this.dialogRef.close(data);
      });
    }
    else if (!this.data.disabledAddress) {
      this.poService.addAddress(this.data.supplierId, this.data.supplierAddress).then(res => {
        if (res.status != 0) {
          this.rfqService.postRFQDetailSupplier(this.data.supplierId, this.data.rfqSupplierData).then(data => {

            if (data.status == 1) {
              this.navService.gaEvent({
                action: 'submit',
                category: 'submit_bid',
                label: null,
                value: null
              });
            }

            this.dialogRef.close(data);
          });
        }
        else {
          this._snackBar.open(res.message, "", {
            duration: 2000, panelClass: ["success-snackbar"],
            verticalPosition: "bottom"
          });
          this.dialogRef.close(null);
        }
      });
    }

  }
}



