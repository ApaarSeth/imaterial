import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserDetails, UserDetailsPopUpData } from '../../models/user-details';
import { UserService } from '../../services/userDashboard/user.service';

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

  userDetails: UserDetails;
  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetailsPopUpData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
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
      : ({} as UserDetails);
    this.form = this.formBuilder.group({
      firstName: [
        this.data.isEdit ? this.data.detail.firstName : "",
        Validators.required
      ],
      lastName: [
        this.data.isEdit ? this.data.detail.lastName : "",
        Validators.required
      ],
      emailId: [this.data.isEdit ? this.data.detail.emailId : ""],
      phoneNo: [
        this.data.isEdit ? this.data.detail.phoneNo : "",
        Validators.required
      ],
      role: [
        this.data.isEdit ? this.data.detail.role : "",
        Validators.required
      ],
      project: [
        this.data.isEdit ? this.data.detail.project: "",
        Validators.required
      ]
    });
  }

  addProjects(userDetails: UserDetails) {
    // this.userService.addProjects(userDetails).then(res => {
    //   //res.data;
    // });
  }

  updateProjects(userDetails: UserDetails) {
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
}
