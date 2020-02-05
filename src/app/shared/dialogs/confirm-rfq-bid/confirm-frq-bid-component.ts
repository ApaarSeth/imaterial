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
    private dialogRef: MatDialogRef<ConfirmRfqBidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetailsPopUpData,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
   
  }

  cancel(){
     this.dialogRef.close({ data: 'close' });
  }

  submit(){
     this.dialogRef.close({ data: 'submit' });
  }

 
}
