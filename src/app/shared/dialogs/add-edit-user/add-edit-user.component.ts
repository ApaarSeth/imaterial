import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {  Roles, AllUserDetails, UserDetailsPopUpData } from '../../models/user-details';
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

   allRoles : Roles[];

 toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  userDetails: AllUserDetails;
  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetailsPopUpData,
    private formBuilder: FormBuilder,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.initForm();
  this.projectService.getProjects(1, 1).then(data => {
            this.allProjects = data.data;
            console.log(this.allProjects);
          });

this.userService.getRoles().then(data => {
            this.allRoles = data.data;
          });


  }

  close() {
    this.dialogRef.close();
  }

  cities: City[] = [
    { value: "Gurgaon", viewValue: "Gurgaon" },
    { value: "Delhi-1", viewValue: "Delhi" },
    { value: "Karnal", viewValue: "Karnal" }
  ];

  projectTypes: ProjectType[] = [
    { type: "RESI HIGH RISE" },
    { type: "MEDICAL HEALTH CARE" },
    { type: "INDUSTRIAL" },
    { type: "RESI LOW RISE" },
    { type: "HOSPITALITY" },
    { type: "RESIDENTIAL HIGH RISE" },
    { type: "RESIDENTIAL LOW RISE" },
    { type: "COMMERCIAL HIGH RISE" },
    { type: "ROADS AND HIGHWAYS" },
    { type: "INTERIOR AND FITOUT" },
    { type: "COMMERCIAL RETAIL" },
    { type: "COMMERCIAL OFFICE" },
    { type: "WAREHOUSE" },
    { type: "FACTORY" }
  ];

  units: Unit[] = [{ value: "sqm" }, { value: "acres" }];

  initForm() {

    

    this.userDetails = this.data.isEdit
      ? this.data.detail
      : ({} as AllUserDetails);


    this.form = new FormGroup({
      firstName: new FormControl(
        this.data.isEdit ? this.data.detail.firstName : "",
        Validators.required
      ),
      lastName: new FormControl(
        this.data.isEdit ? this.data.detail.lastName : "",
        Validators.required
      ),
      emailId: new FormControl(this.data.isEdit ? this.data.detail.email : "", [Validators.required,  Validators.pattern(FieldRegExConst.EMAIL)]),
      phoneNo: new FormControl(
        this.data.isEdit ? this.data.detail.contactNo : "",
        [Validators.required, Validators.pattern(FieldRegExConst.MOBILE)]
      ),
      role: new FormControl(
        this.data.isEdit ? this.data.detail.roleName : "",
        Validators.required
      ),
      project: new FormControl(
        this.data.isEdit ? this.data.detail.ProjectList: "",
        Validators.required
      )
    });
  }

  addProjects(userDetails: AllUserDetails) {
    // this.userService.addProjects(userDetails).then(res => {
    //   //res.data;
    // });
  }

  updateProjects(userDetails: AllUserDetails) {
    // if (userDetails) {
    //   let projectId = this.data.detail.projectId;
    //   let organizationId = this.data.detail.organizationId;
    //   this.userService
    //     .updateProjects(organizationId, projectId, userDetails)
    //     .then(res => {
    //       res.data;
    //     });
    // }
  }

  submit() {
    console.log(this.form.value);
    if (this.data.isEdit) {
      this.dialogRef.close(this.updateProjects(this.form.value));
    } else {
      this.dialogRef.close(this.addProjects(this.form.value));
    }
  }

  userDetailsNavigate(){
    this.router.navigate(["users/user-detail"]);
    }
  
}
