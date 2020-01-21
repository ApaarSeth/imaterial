import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

// Component for dialog box
@Component({
  selector: "comment-dialog",
  templateUrl: "./comment-dialog.html"
})

// Component class
export class AddCommentDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddCommentDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
