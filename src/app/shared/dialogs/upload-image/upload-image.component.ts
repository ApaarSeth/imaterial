import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "upload-image-dialog",
  templateUrl: "upload-image.component.html"
})

export class UploadImageComponent implements OnInit {

  supplierId: number;
  images: string[];

  constructor(
    private dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}