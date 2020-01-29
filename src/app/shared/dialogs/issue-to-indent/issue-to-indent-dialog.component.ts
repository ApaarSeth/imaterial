import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { IssueToIndentDetails } from '../../models/issue-to-indent';
import { ActivatedRoute } from '@angular/router';

// Component for dialog box
@Component({
  selector: "issue-to-indent",
  templateUrl: "./issue-to-indent-dialog.html"
})

// Component class
export class IssueToIndentDialogComponent {

  IssueToIndent: IssueToIndentDetails;

  constructor(public dialogRef: MatDialogRef<IssueToIndentDialogComponent>, private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    this.IssueToIndent = this.activatedRoute.snapshot.data.IssueToIndent;
    console.log("IssueToIndent", this.IssueToIndent);

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
