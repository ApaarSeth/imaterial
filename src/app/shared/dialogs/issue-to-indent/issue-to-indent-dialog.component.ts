import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef } from "@angular/material";
import { IssueToIndentDetails, IssuedQuantityDetail } from '../../models/issue-to-indent';
import { BomService } from '../../services/bom/bom.service';

@Component({
  selector: "issue-to-indent",
  templateUrl: "./issue-to-indent-dialog.html",
  styleUrls: ["../../../../assets/scss/main.scss"]

})

export class IssueToIndentDialogComponent implements OnInit {

  issueToIndentDetails: IssueToIndentDetails;

  constructor(public dialogRef: MatDialogRef<IssueToIndentDialogComponent>, private activatedRoute: ActivatedRoute,
    private bomService: BomService) { }

  ngOnInit() {

    // this.IssueToIndent = this.activatedRoute.snapshot.data.issueToIndent;
    // console.log("activatedroute", this.activatedRoute)
    // console.log("IssueToIndent", this.IssueToIndent);
    this.getIndentDetails();
  }

  getIndentDetails() {
    this.bomService.getIssueToIndent(13, 4).then(data => {
      console.log("asdfgh", data.data);
      this.issueToIndentDetails = data.data;
    });
  }

  postIssueQuantity(indentDetailList) {
    this.bomService.postIssueToIndent(13, indentDetailList).then(res => {
      res.data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
