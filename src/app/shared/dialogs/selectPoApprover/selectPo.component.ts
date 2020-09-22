import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { POService } from "../../services/po.service";
import { POData, ApproverData, DocumentList } from "../../models/PO/po-data";

@Component({
  selector: "select-supplier-dialog",
  templateUrl: "selectPo.html"
})

export class SelectApproverComponent implements OnInit {

  documentList: DocumentList[] = [];
  orgId: number;
  approverData: ApproverData[] = [];
  selectedApprover: ApproverData;

  constructor(
    private poService: POService,
    private dialogRef: MatDialogRef<SelectApproverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: POData
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.poService
      .getApproverData(this.orgId, this.data.projectId)
      .then(res => {
        this.approverData = res.data;
      });
  }

  sendPo() {
    this.data.approverId = this.selectedApprover.userId;
    this.dialogRef.close(this.data);
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}
