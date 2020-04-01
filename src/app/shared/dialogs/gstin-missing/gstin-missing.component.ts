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
import { Router } from '@angular/router';


@Component({
  selector: "gstin-missing-dialog",
  templateUrl: "gstin-missing.component.html"
})
export class GSTINMissingComponent implements OnInit {
  projectDetails: ProjectDetails;
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<GSTINMissingComponent>,
    private _snackBar: MatSnackBar,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
  }

  close() {
    this.router.navigate(["/project-dashboard"])
    this.dialogRef.close(null);
  }

}
