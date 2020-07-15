import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { DocumentUploadService } from '../../services/document-download/document-download.service';
import { ImageService } from '../../services/image-integration/image.service';
import { ImageDocsLists } from '../../models/PO/po-data';

@Component({
  selector: "view-image-dialog",
  templateUrl: "view-image.component.html"
})

export class ViewImageComponent implements OnInit {

  selectedImages: ImageDocsLists[] = [];
  rfqId: number;

  constructor(
    private dialogRef: MatDialogRef<ViewImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _imageService: ImageService
  ) { }

  ngOnInit() {
    if(this.data.type === 'rfq'){
      this.getAllRfqImages();
    }else if(this.data.type === 'supplier'){
      this.rfqId = Number(this.data.rfqId);
      this.selectedImages = this.data.displayImages.documentsList;
      const contractorImages = this.selectedImages.filter(img => img.documentUrl === "" && img.supplierId === null);
      if(contractorImages.length > 0){
        this.getAllRfqImages();
      }
    }else{
      this.getAllImages();
    }
  }

  getAllImages(){
    this._imageService.getSelectedImages(this.data.projectId, this.data.materialId).then(res => {
      this.selectedImages = res.data;
    })
  }

  getAllRfqImages(){
    this._imageService.getRfqUploadedImages(this.data.rfqId, this.data.materialId).then(res => {
      this.selectedImages = res.data;
    })
  }

  downloadImage(fileName, url){
    const data = { fileName, url }
    this._imageService.downloadImage(data).then(img => {
      var win = window.open(img.data.url, '_blank');
      win.focus();
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

}