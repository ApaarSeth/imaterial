import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { POService } from "../../services/po/po.service";
import { POData, ApproverData, DocumentList } from "../../models/PO/po-data";
import { DocumentUploadService } from "../../services/document-download/document-download.service";

@Component({
  selector: "select-supplier-dialog",
  templateUrl: "selectPo.html",
  styleUrls: ["../../../../assets/scss/pages/selectApprover.scss"]
})
export class SelectApproverComponent implements OnInit {
  documentList: DocumentList[] = [];
  constructor(
    private documentUploadService: DocumentUploadService,
    private poService: POService,
    private dialogRef: MatDialogRef<SelectApproverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: POData
  ) {}
  approverData: ApproverData[] = [];
  selectedApprover: ApproverData;
  ngOnInit() {
    console.log(this.data);
    this.poService.getApproverData(1, this.data.projectId).then(res => {
      this.approverData = res.data;
      console.log(this.approverData);
    });
  }

  sendPo() {
    console.log(this.selectedApprover);
    this.data.approverId = this.selectedApprover.user_d;
    this.poService.sendPoData(this.data);
  }
}
