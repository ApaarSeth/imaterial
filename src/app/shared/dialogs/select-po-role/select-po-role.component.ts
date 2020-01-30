import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { POService } from "../../services/po/po.service";
import { POData, ApproverData } from "../../models/PO/po-data";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "select-supplier-dialog",
  templateUrl: "selectPoRole.html",
  styleUrls: ["../../../../assets/scss/pages/selectPoRole.scss"]
})
export class SelectPoRoleComponent implements OnInit {
  displayedColumns: string[] = ["User Name", "Role", "Email", "Phone"];
  constructor(
    private poService: POService,
    private dialogRef: MatDialogRef<SelectPoRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder
  ) {}
  approverFrm: FormGroup;
  approverData: ApproverData[] = [];
  selectedApprover: ApproverData;
  ngOnInit() {
    console.log(this.data);
    this.poService.getApproverData(1, this.data.projectId).then(res => {
      this.approverData = res.data.map((approver, i) => {
        if (i == 0) {
          approver.checked = true;
        } else {
          approver.checked = false;
        }
        return approver;
      });
      console.log("app", this.approverData);
      this.approverFrm.controls["approver"].setValue(this.approverData[0]);
    });
    this.formInit();
  }

  formInit() {
    this.approverFrm = this.formBuilder.group({
      approver: []
    });
  }
  selectRole() {
    console.log(this.approverFrm);
    console.log(this.approverFrm.value);
    this.dialogRef.close([this.data.roleType, this.approverFrm.value]);
  }
  //   sendPo() {
  //     console.log(this.selectedApprover);
  //     this.data.approverId = this.selectedApprover.user_d;
  //     this.poService.sendPoData(this.data);
  //   }
}