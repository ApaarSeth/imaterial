import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { POService } from "../../services/po/po.service";
import { POData, ApproverData } from "../../models/PO/po-data";

@Component({
  selector: "select-supplier-dialog",
  templateUrl: "selectPo.html",
  styleUrls: ["../../../../assets/scss/pages/selectApprover.scss"]
})
export class SelectApproverComponent implements OnInit {
  constructor(
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
    this.poService.sendPoData(this.data);
  }

  sendPo() {
    console.log(this.selectedApprover);
    this.data.approverId = this.selectedApprover.user_d;
    this.poService.sendPoData(this.data);
  }
}
