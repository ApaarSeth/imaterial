import { Component, Inject, Input, OnInit } from "@angular/core";
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
import { POData } from '../../models/PO/po-data';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: "gstin-missing-dialog",
  templateUrl: "gstin-missing.component.html"
})
export class GSTINMissingComponent implements OnInit {
  projectDetails: ProjectDetails;
  projectName: string
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<GSTINMissingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: POData,
    private _snackBar: MatSnackBar,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.projectName = this.data.projectAddress.projectName;
  }

  close() {
    this.dialogRef.close(null);
  }

  closeModal() {
    this.dialogRef.close(null);
  }
}
