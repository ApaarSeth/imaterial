import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DocumentUploadService } from '../../services/document-download/document-download.service';

@Component({
  selector: "view-image-dialog",
  templateUrl: "view-image.component.html"
})

export class ViewImageComponent implements OnInit {

  selectedImages: string[];

  constructor(
    private dialogRef: MatDialogRef<ViewImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _imageService: DocumentUploadService
  ) { }

  ngOnInit() {
    const selectedMaterial = this.data.result.filter(res => res.materialId === this.data.selectedMaterialId);
    console.log(selectedMaterial[0]);

    // this._imageService.getSelectedImages(selectedMaterial[0].projectId, selectedMaterial[0].materialId).then(res => {
    //   console.log(res);
    // })


    this.selectedImages = selectedMaterial[0].documentsList.map(element => element.documentUrl);
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}