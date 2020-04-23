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
  selector: "display-project-details-dialog",
  templateUrl: "display-project-details.component.html"
})

export class DisplayProjectDetailsComponent implements OnInit {
vid : any;
  projectDetails: ProjectDetails;


  constructor(

    private dialogRef: MatDialogRef<DisplayProjectDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDetails,
    private router: Router,
    private projectService: ProjectService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.projectDetails = this.data;
  }
  
  close() {
    this.dialogRef.close(null);
  }

}