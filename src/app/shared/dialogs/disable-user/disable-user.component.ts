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
  selector: "disable-user-dialog",
  templateUrl: "disable-user-component.html"
})
export class DeactiveUserComponent implements OnInit {
    userDetails: AllUserDetails;
  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<DeactiveUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetailsPopUpData,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
   
  }

  deactivateUserService(){
    this.userDetails = this.data.isDelete
      ? this.data.detail
      : ({} as AllUserDetails);

    if(this.data.isDelete){
      this.userService.deactivateUser(this.data.detail.userId).then(res =>  res.data);
    }
  }

  cancel(){
     this.dialogRef.close({ data: 'data' });
  }

  deactivateUser(){
     this.dialogRef.close(this.deactivateUserService());
  }

 
}
