import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder } from "@angular/forms";
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ProjectDetails, ProjetPopupData } from '../../models/project-details';
import { ProjectService } from '../../services/project.service';

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
  selector: "delete-drafted-po-dialog",
  templateUrl: "delete-drafted-po.component.html"
})
export class DeleteDraftedPoComponent implements OnInit {
  projectDetails: ProjectDetails;
  orgId: number;
  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<DeleteDraftedPoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjetPopupData,
    private formBuilder: FormBuilder,
    private router: Router,
    private projectService: ProjectService
  ) { }

  ngOnInit() {

    this.orgId = Number(localStorage.getItem("orgId"));
  }

  deleteDraftedPO() {
    this.projectDetails = this.data.isDelete
      ? this.data.detail
      : ({} as ProjectDetails);

    if (this.data.isDelete) {
      this.projectService.deleteDraftedPo(this.data.detail.purchaseOrderId).then(res => res.data);
    }
  }

  cancel() {
    this.dialogRef.close({ data: 'data' });
  }

  deactivateUser() {
    this.dialogRef.close(this.deleteDraftedPO());
  }


}
