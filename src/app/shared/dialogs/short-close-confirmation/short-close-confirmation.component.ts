import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProjectDetails, ProjetPopupData } from "../../models/project-details";
import { ProjectService } from "../../services/project.service";


@Component({
  selector: "app-short-close-confirmation",
  templateUrl: "short-close-confirmation.component.html"
})
export class ShortCloseConfirmationComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ShortCloseConfirmationComponent>,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close(null);
  }

  delete() {
    this.dialogRef.close('yes');
  }
}
