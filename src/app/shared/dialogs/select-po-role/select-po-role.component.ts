import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { POService } from "../../services/po.service";
import { ApproverData } from "../../models/PO/po-data";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "select-supplier-dialog",
  templateUrl: "selectPoRole.html"
})

export class SelectPoRoleComponent implements OnInit {

  displayedColumns: string[] = ["User Name", "Role", "Email", "Phone"];
  orgId: number;
  approverFrm: FormGroup;
  approverData: ApproverData[] = [];
  selectedApprover: ApproverData;

  constructor(
    private poService: POService, 
    private dialogRef: MatDialogRef<SelectPoRoleComponent>, 
    @Inject(MAT_DIALOG_DATA) public data, 
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.poService.getApproverData(this.orgId, this.data.projectId).then(res => {
      this.approverData = res.data.map((approver, i) => {
        if (i == 0) {
          approver.checked = true;
        } else {
          approver.checked = false;
        }
        return approver;
      });
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
    this.dialogRef.close([this.data.roleType, this.approverFrm.value]);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}