import { Component, OnInit } from "@angular/core";
import { ProjectDetails } from "../../models/project-details";
import { ProjectService } from "../../services/project.service";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: "app-delete-myMaterial-dialog",
  templateUrl: "delete-myMaterial-confirmation.component.html"
})
export class DeleteMyMaterialComponent implements OnInit {
  projectDetails: ProjectDetails;
  constructor(
    private dialogRef: MatDialogRef<DeleteMyMaterialComponent>,
    private _snackBar: MatSnackBar,
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
