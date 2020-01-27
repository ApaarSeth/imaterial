import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

// Component for dialog box
@Component({
  selector: "issue-to-indent",
  templateUrl: "./issue-to-indent-dialog.html"
})

// Component class
export class IssueToIndentDialogComponent {
  constructor(public dialogRef: MatDialogRef<IssueToIndentDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
