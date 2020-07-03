import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "view-image-dialog",
  templateUrl: "view-image.component.html"
})

export class ViewImageComponent implements OnInit {

  supplierId: number;
  images: string[];

  constructor(
    private dialogRef: MatDialogRef<ViewImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    const selectedImages = this.data.result.filter(res => res.materialId === this.data.selectedMaterialId);
    this.images = selectedImages[0].attachedImages;
    // this.images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}