import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ImageService } from '../../services/image-integration/image.service';
import { ImageDocsLists, ImageList } from '../../models/PO/po-data';

@Component({
  selector: "view-image-dialog",
  templateUrl: "view-image.component.html"
})

export class ViewImageComponent implements OnInit {

  rfqId: number;
  selectedImages: ImageDocsLists[] = [];
  prevContractorImgs: ImageDocsLists[] = [];
  supplierImages: ImageDocsLists[] = [];
  isAddOpacity: boolean;

  constructor(
    private dialogRef: MatDialogRef<ViewImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _imageService: ImageService
  ) { }

  ngOnInit() {
    if(this.data.type === 'rfq' || this.data.type === 'create-rfq'){
      this.getAllRfqImages();
    }else if(this.data.type === 'supplier'){
      this.rfqId = Number(this.data.rfqId);
      this.selectedImages = this.data.displayImages.documentsList;
      const contractorImages = this.selectedImages.filter(img => img.documentUrl === "" && img.supplierId === null);
      if(contractorImages.length > 0){
        this.getAllRfqImages();
      }
    }else if(this.data.type === 'bid'){
      this.getAllRfqImages();
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
      if(this.data.type === 'bid'){
        this.prevContractorImgs = res.data;
        this.selectedImages = [...(this.prevContractorImgs ? this.prevContractorImgs : []), ...(this.supplierImages ? this.supplierImages : [])];
      }else if(this.data.type === 'create-rfq'){
        
        let rfqPrevImages: ImageDocsLists[] = [];

        if(this.data.selectedMaterial && this.data.selectedMaterial.documentList && res.data){
          this.data.selectedMaterial.documentList.forEach(prevImg => res.data.forEach(newImg => {
            if(prevImg.documentId === newImg.documentId){
              rfqPrevImages.push(newImg);
            }
          }));
        }

        const newUploadedImageList = (this.data.selectedMaterial && this.data.selectedMaterial.documentList) ? this.data.selectedMaterial.documentList.filter(opt => opt.documentId === 0) : [];
        this.selectedImages = [...rfqPrevImages, ...newUploadedImageList];
      }else{
        this.selectedImages = res.data;
      }
    })
  }

  /**
   * @description get all images uploaded by supplier
   */
  getAllSupplierImages(){
    this._imageService.getSupplierUploadedImages(this.data.rfqId, this.data.materialId, this.data.supplierId).then(res => {
      //combined both supplier images and contractor images for specific material
      this.supplierImages = res.data;
      this.selectedImages = [...(this.prevContractorImgs ? this.prevContractorImgs : []), ...(this.supplierImages ? this.supplierImages : [])];
    });
  }

  /**
   * @description get all uploaded images of Purchase Order
   */
  getAllPOImages(){
    this._imageService.getPOImages(this.data.purchaseOrderId, this.data.materialId).then(res => {
      
      // code to get distinct values of documentList and remove duplicate values
      if(res.data){
        this.selectedImages = res.data.reduce((unique, o) => {
          if(!unique.some(obj => obj.documentId === o.documentId)) {
            unique.push(o);
          }
          return unique;
        },[]);
      }
      // this.selectedImages = res.data;
    })
  }

  downloadImage(fileName, url){
    // url = undefined;
    const data = { fileName, url }
    this._imageService.downloadImage(data).then(img => {
      var win = window.open(img.data.url, '_blank');
      win.focus();
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  addRemoveOverlay($event){
    this.isAddOpacity = $event.type == 'mouseenter' ? true : false;
  }
}