import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProjectDetails, ProjetPopupData } from '../../models/project-details';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: "delete-drafted-po-dialog",
  templateUrl: "delete-drafted-po.component.html"
})

export class DeleteDraftedPoComponent implements OnInit {

  projectDetails: ProjectDetails;
  orgId: number;

  constructor(
    private dialogRef: MatDialogRef<DeleteDraftedPoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjetPopupData,
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
    // this.dialogRef.close({ data: 'data' });
    this.dialogRef.close(null);
  }

  deactivateUser() {
    this.dialogRef.close(this.deleteDraftedPO());
  }
}