import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
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
    }else if(this.data.type === 'bid'){
      this.getAllSupplierImages();
    }else if(this.data.type === 'po'){
      this.getAllPOImages();
    }else{
      this.getAllImages();
    } 
  }

  /**
   * @description get all uploaded images of BOM
   */
  getAllImages(){
    this._imageService.getSelectedImages(this.data.projectId, this.data.materialId).then(res => {
      this.selectedImages = res.data;
    })
  }

  /**
   * @description get all uploaded images of RFQ
   */
  getAllRfqImages(){
    this._imageService.getRfqUploadedImages(this.data.rfqId, this.data.materialId).then(res => {
      this.selectedImages = res.data;
    })
  }

  /**
   * @description get all images uploaded by supplier
   */
  getAllSupplierImages(){
    this._imageService.getSupplierUploadedImages(this.data.rfqId, this.data.materialId, this.data.supplierId).then(res => {
      this.selectedImages = res.data;
    })
  }

  /**
   * @description get all uploaded images of Purchase Order
   */
  getAllPOImages(){
    this._imageService.getPOImages(this.data.purchaseOrderId, this.data.materialId).then(res => {
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