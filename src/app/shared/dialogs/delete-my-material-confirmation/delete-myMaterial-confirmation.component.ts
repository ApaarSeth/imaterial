import { Component, OnInit } from "@angular/core";
import { ProjectDetails } from "../../models/project-details";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-delete-myMaterial-dialog",
  templateUrl: "delete-myMaterial-confirmation.component.html"
})

export class DeleteMyMaterialComponent implements OnInit {

  projectDetails: ProjectDetails;

  constructor(
    private dialogRef: MatDialogRef<DeleteMyMaterialComponent>
  ) { }

  ngOnInit(){}

  close() {
    this.dialogRef.close(null);
  }

  delete() {
    this.dialogRef.close('yes');
  }
}
