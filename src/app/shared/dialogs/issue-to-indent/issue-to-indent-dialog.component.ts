import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef } from "@angular/material";
import { IssueToIndentDetails, IndentVO, sendIssuedQuantityObj } from '../../models/issue-to-indent';
import { BomService } from '../../services/bom/bom.service';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

@Component({
  selector: "issue-to-indent",
  templateUrl: "./issue-to-indent-dialog.html",
  styleUrls: ["../../../../assets/scss/main.scss"]

})

export class IssueToIndentDialogComponent implements OnInit {

  issueToIndentDetails: IssueToIndentDetails;
  materialForms: FormGroup;
  dataSource: IndentVO;

  constructor(public dialogRef: MatDialogRef<IssueToIndentDialogComponent>, private activatedRoute: ActivatedRoute,
    private bomService: BomService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    // this.IssueToIndent = this.activatedRoute.snapshot.data.issueToIndent;
    // console.log("activatedroute", this.activatedRoute)
    // console.log("IssueToIndent", this.IssueToIndent);
    this.getIndentDetails();

  }


  formsInit(indentDetail) {
    const frmArr = indentDetail.indentDetailList.map((indent: IndentVO) => {
      return this.formBuilder.group({
        indentId: [indent.indentId],
        issuedQty: ["", Validators.required],
        issuedDate: [indent.dueDate]
      });
    });


    this.materialForms = this.formBuilder.group({
      forms: new FormArray(frmArr)
    });

    console.log(this.materialForms);
  }

  showIndent() {
    const formValues: sendIssuedQuantityObj[] = this.materialForms.value.forms;
    console.log("result", formValues);

    this.bomService.postIssueToIndent(13, formValues).then(res => {
      res.data;
    });
    // this.indentService.raiseIndent(this.projectId, dataSource).then(res => {
    //   this.router.navigate(["/indent/" + this.projectId + "/indent-detail"]);
    // });
  }

  getIndentDetails() {
    this.bomService.getIssueToIndent(13, 4).then(data => {
      console.log("asdfgh", data.data);
      this.issueToIndentDetails = data.data;
      this.formsInit(this.issueToIndentDetails);
    });
  }

  // postIssueQuantity(indentDetailList) {
  //   this.bomService.postIssueToIndent(13, indentDetailList).then(res => {
  //     res.data;
  //   });
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
