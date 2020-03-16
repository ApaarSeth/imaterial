import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { Roles, AllUserDetails, UserDetailsPopUpData, UserAdd } from '../../models/user-details';
import { UserService } from '../../services/userDashboard/user.service';
import { Router } from '@angular/router';
import { FieldRegExConst } from '../../constants/field-regex-constants';
import { ProjectService } from '../../services/projectDashboard/project.service';
import { ProjectDetails } from '../../models/project-details';


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
  selector: "add-edit-user-dialog",
  templateUrl: "add-edit-user-component.html"
})

export class AddEditUserComponent implements OnInit {

  form: FormGroup;
  startDate = new Date(1990, 0, 1);
  endDate = new Date(2021, 0, 1);
  allProjects: ProjectDetails[];
  allRoles: Roles[];
  userDetails: AllUserDetails;
  isInputDisabled: boolean = true;
  orgId: number;
  userId: number;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetailsPopUpData,
    private formBuilder: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.initForm();
    this.orgId = Number(localStorage.getItem("orgId"))
    this.userId = Number(localStorage.getItem("userId"))
    this.projectService.getProjects(this.orgId, this.userId).then(data => {
      this.allProjects = data.data;
    });

    this.userService.getRoles().then(data => {
      this.allRoles = data.data;
    });
  }

  close() {
    this.dialogRef.close(null);
  }

  initForm() {

    this.userDetails = this.data.isEdit
      ? this.data.detail
      : ({} as AllUserDetails);

    this.isInputDisabled = this.data.isEdit;

    this.form = new FormGroup({
      firstName: new FormControl(
        { value: this.data.isEdit ? this.data.detail.firstName : "" },
        Validators.required
      ),
      lastName: new FormControl(
        { value: this.data.isEdit ? this.data.detail.lastName : "" },
        Validators.required
      ),
      email: new FormControl(
        { value: this.data.isEdit ? this.data.detail.email : "" },
        [Validators.required, Validators.pattern(FieldRegExConst.EMAIL)]),

      contactNo: new FormControl(
        { value: this.data.isEdit ? this.data.detail.contactNo : "" },
        // [Validators.required, Validators.pattern(FieldRegExConst.MOBILE)]
      ),
      roleId: new FormControl(
        this.data.isEdit ? this.data.detail.roleId : "",
        Validators.required
      ),
      projectIds: new FormControl(
        this.data.isEdit ? this.data.detail.projectIds : []
      ),
      creatorId: new FormControl(''),
      userId: new FormControl(this.data.isEdit ? this.data.detail.userId : null)

    });
  }

  addUsers(userDetails: UserAdd) {

    userDetails.creatorId = this.userId;
    userDetails.projects = userDetails.projectIds;
    var form_data = new FormData();

    for (var key in userDetails) {
      form_data.append(key, userDetails[key]);
    }

    this.userService.addUsers(userDetails).then(res => {
      if (res) {
        this.dialogRef.close(res.message);
        this._snackBar.open(res.message, "", {
          duration: 2000,
          panelClass: ["success-snackbar"],
          verticalPosition: "top"
        });
        return res.data;
      }

    });
  }

  updateUsers(userDetails: UserAdd) {
    if (userDetails) {
      userDetails.creatorId = this.userId;
      userDetails.userId = userDetails.userId;

      this.userService
        .updateUsers(userDetails)
        .then(res => {
          if (res) {
            this.dialogRef.close(res.message);
            this._snackBar.open(res.message, "", {
              duration: 2000,
              panelClass: ["success-snackbar"],
              verticalPosition: "top"
            });
            return res.data;
          }
        });
    }
  }

  submit() {
    if (this.data.isEdit) {
      this.updateUsers(this.form.value);
    } else {
      this.addUsers(this.form.value);
    }
  }

  userDetailsNavigate() {
    this.router.navigate(["users/user-detail"]);
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}