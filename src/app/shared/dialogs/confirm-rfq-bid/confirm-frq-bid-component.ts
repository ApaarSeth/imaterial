import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AllUserDetails, UserDetailsPopUpData } from '../../models/user-details';
import { UserService } from '../../services/userDashboard/user.service';
import { Router } from '@angular/router';
import { POService } from '../../services/po/po.service';
import { RFQService } from '../../services/rfq/rfq.service';

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
    private rfqService: RFQService
  ) {}

  ngOnInit() {
    console.log(this.data);
    
  }

  cancel(){
     this.dialogRef.close({ data: 'close' });
  }

  submit(){
    return Promise.all([
      this.poService.addAddress(this.data.supplierId, this.data.supplierAddress),
      this.rfqService.postRFQDetailSupplier(this.data.supplierId, this.data.rfqSupplierData)
    ]).then(data => {
        this.dialogRef.close(data);
    });
  }

 
}
