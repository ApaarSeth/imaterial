import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProjectDetails, ProjetPopupData } from "../../models/project-details";
import { ProjectService } from "../../services/projectDashboard/project.service";


@Component({
  selector: "double-confirmation-dialog",
  templateUrl: "double-confirmation-component.html"
})
export class DoubleConfirmationComponent implements OnInit {
  projectDetails: ProjectDetails;
  constructor(
    private dialogRef: MatDialogRef<DoubleConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjetPopupData,
    private _snackBar: MatSnackBar,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.projectDetails = this.data.detail;
  }

  close() {
    this.dialogRef.close(null);
  }

  delete() {
    this.projectService
      .delete(this.projectDetails.organizationId, this.projectDetails.projectId)
      .then(res => {
        res.data;
        if (res) {
          this.dialogRef.close(res.message);
          this._snackBar.open(res.message, "", {
            duration: 2000,
            panelClass: ["success-snackbar"],
            verticalPosition: "top"
          });

        }
      });
  }
}
