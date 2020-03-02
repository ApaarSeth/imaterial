import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { ProjectDetails, ProjetPopupData } from "../../models/project-details";
import { ProjectService } from "../../services/projectDashboard/project.service";
import { FieldRegExConst } from "../../constants/field-regex-constants";

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
  selector: "add-project-dialog",
  templateUrl: "add-project-component.html"
})
export class AddProjectComponent implements OnInit {

  form: FormGroup;
  startDate = new Date(1990, 0, 1);
  endDate = new Date(2021, 0, 1);
  minDate = new Date();
  projectDetails: ProjectDetails;
  orgId: number;
  userId: number;
  selectedConstructionUnit: String;

  constructor(
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjetPopupData,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.selectedConstructionUnit = "1";
    this.initForm();
  }

  cities: City[] = [
    { value: "Gurgaon", viewValue: "Gurgaon" },
    { value: "Delhi", viewValue: "Delhi" },
    { value: "Karnal", viewValue: "Karnal" }
  ];

  projectTypes: ProjectType[] = [
    { type: "RESIDENTIAL" },
    { type: "COMMERCIAL" },
    { type: "INTERIOR FIT-OUT" },
    { type: "INDUSTRIAL" },
    { type: "HOSPITALITY" },
    { type: "INFRASTRUCTURE" },
    { type: "OTHERS" }
  ];

  units: Unit[] = [{ value: "acres" }, { value: "sqm" }, { value: "sqft" }];

  initForm() {
    this.projectDetails = this.data.isEdit
      ? this.data.detail
      : ({} as ProjectDetails);
    this.form = this.formBuilder.group({
      projectName: [
        this.data.isEdit ? this.data.detail.projectName : "",
        Validators.required
      ],
      addressLine1: [
        this.data.isEdit ? this.data.detail.addressLine1 : "",
        Validators.required
      ],
      addressLine2: [this.data.isEdit ? this.data.detail.addressLine2 : ""],
      pinCode: [
        this.data.isEdit ? this.data.detail.pinCode : "",
        [Validators.required, Validators.pattern(FieldRegExConst.PINCODE)]
      ],
      state: [
        this.data.isEdit ? this.data.detail.state : "",
        Validators.required
      ],
      city: [
        this.data.isEdit ? this.data.detail.city : "",
        Validators.required
      ],
      area: [
        this.data.isEdit ? this.data.detail.area : "",
        Validators.required
      ],
      startDate: [
        this.data.isEdit ? this.data.detail.startDate : "",
        Validators.required
      ],
      endDate: [
        this.data.isEdit ? this.data.detail.endDate : "",
        Validators.required
      ],
      cost: [
        this.data.isEdit ? this.data.detail.cost : "",
        Validators.required
      ],
      type: [
        this.data.isEdit ? this.data.detail.type : "",
        Validators.required
      ],
      unit: [this.data.isEdit ? this.data.detail.unit : ""],
      gstNo: [
        this.data.isEdit ? this.data.detail.gstNo : "",
        [Validators.pattern(FieldRegExConst.GSTIN)]
      ]
    });
  }

  addProjects(projectDetails: ProjectDetails) {
    this.projectService
      .addProjects(projectDetails, this.orgId, this.userId)
      .then(res => {
       // res.data;
        this.dialogRef.close(res.message);
        if (res) {
          this._snackBar.open(res.message, "", {
            duration: 2000,
            panelClass: ["blue-snackbar"]
          });
        }
      });
  }

  updateProjects(projectDetails: ProjectDetails) {
    if (projectDetails) {
      let projectId = this.data.detail.projectId;
      let organizationId = this.data.detail.organizationId;
      this.projectService
        .updateProjects(organizationId, projectId, projectDetails)
        .then(res => {
          if (res) {
            this.dialogRef.close(res.message);

            this._snackBar.open(res.message, "", {
              duration: 2000,
              panelClass: ["blue-snackbar"]
            });

          }
        });
    }
  }

formatDate(oldDate): Date {
   let newDate= new Date(oldDate);
   newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    return newDate;
  }

  submit() {
    if (this.data.isEdit) {
   
     this.form.value.startDate = this.formatDate(this.form.value.startDate);
     this.form.value.endDate = this.formatDate(this.form.value.endDate);

      this.updateProjects(this.form.value);
    } else {
      this.form.value.startDate = this.formatDate(this.form.value.startDate);
      this.form.value.endDate = this.formatDate(this.form.value.endDate);
      this.addProjects(this.form.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

  getStart(event) {
    const x = event.indexOf('/');
    const month = event.substring(0, x);

    event = event.replace('/', '-');
    const y = event.indexOf('/');
    const day = event.substring(x + 1, y);


    const year = event.substring(y + 1, 10);

    this.minDate = new Date(year, month - 1, day)

  }
  uploadPhoto() { }
}