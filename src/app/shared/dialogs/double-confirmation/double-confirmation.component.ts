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

//   export interface City {
//     value: string;
//     viewValue: string;
//   }

@Component({
  selector: "double-confirmation-dialog",
  templateUrl: "double-confirmation-component.html"
})
export class DoubleConfirmationComponent implements OnInit {
  projectDetails: ProjectDetails;
  constructor(
    private dialogRef: MatDialogRef<DoubleConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjetPopupData,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.projectDetails = this.data.detail;
  }

  close() {
    this.dialogRef.close();
  }

  delete() {
    this.projectService
      .delete(this.projectDetails.organizationId, this.projectDetails.projectId)
      .then(res => {
        res.data;
        console.log("asdfghjkl", res.data);
      });
  }
}
