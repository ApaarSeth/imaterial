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
  selector: "disable-user-dialog",
  templateUrl: "disable-user-component.html"
})
export class DeactiveUserComponent implements OnInit {
  userDetails: AllUserDetails;
  orgId: number;
  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<DeactiveUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetailsPopUpData,
    private formBuilder: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    this.orgId = Number(localStorage.getItem("orgId"));
  }

  deactivateUserService() {
    this.userDetails = this.data.isDelete
      ? this.data.detail
      : ({} as AllUserDetails);

    if (this.data.isDelete) {
      this.userService.deactivateUser(this.data.detail.userId).then(res => {
        if (res) {
          this.dialogRef.close(res.message);
          this._snackBar.open(res.message, "", {
            duration: 2000,
            panelClass: ["success-snackbar"],
            verticalPosition: "bottom"
          });
          return res.data;
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  deactivateUser() {
    this.deactivateUserService();
  }


}
