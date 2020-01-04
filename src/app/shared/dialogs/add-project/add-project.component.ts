import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProjectDetails, ProjetPopupData } from "../../models/project-details";
import { ProjectService } from "../../services/projectDashboard/project.service";

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
  //@Input('name') name: string;
  //@Input('animal') animal: string;

  form: FormGroup;
  startDate = new Date(1990, 0, 1);
  endDate = new Date(2021, 0, 1);

  projectDetails: ProjectDetails;
  constructor(
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjetPopupData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
  }

  close() {
    this.dialogRef.close();
  }

  cities: City[] = [
    { value: "Gurgaon-0", viewValue: "Gurgaon" },
    { value: "Delhi-1", viewValue: "Delhi" },
    { value: "Karnal-2", viewValue: "Karnal" }
  ];

  projectTypes: ProjectType[] = [
    { type: "aaaa" },
    { type: "bbbb" },
    { type: "cccc" }
  ];

  units: Unit[] = [{ value: "sqr" }, { value: "br" }, { value: "cr" }];

  initForm() {
    this.projectDetails = this.data.isEdit
      ? this.data.detail
      : ({} as ProjectDetails);

    this.form = this.formBuilder.group({
      name: [
        this.data.isEdit ? this.data.detail.projectName : "",
        Validators.required
      ],
      address1: [
        this.data.isEdit ? this.data.detail.addressLine1 : "",
        Validators.required
      ],
      address2: [this.data.isEdit ? this.data.detail.addressLine2 : ""],
      pinCode: [
        this.data.isEdit ? this.data.detail.pinCode : "",
        Validators.required
      ],
      state: [
        this.data.isEdit ? this.data.detail.state : "",
        Validators.required
      ],
      city: [
        this.data.isEdit ? this.data.detail.city : "",
        Validators.required
      ],
      projectArea: [this.data.isEdit ? this.data.detail.area : ""],
      constructionCost: [
        this.data.isEdit ? this.data.detail.cost : "",
        Validators.required
      ]
    });
  }

  addProjects(projectDetails: ProjectDetails) {
    this.projectService.addProjects(1, 1, projectDetails).then(res => {
      //res.data;
    });
  }

  submit() {
    console.log(this.form.value);
    this.dialogRef.close(this.addProjects(this.form.value));
  }
}
