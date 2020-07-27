import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { DocumentList, ImageList, ImageDocsLists } from '../../models/PO/po-data';

import { ImageService } from '../../services/image-integration/image.service';
import { DocumentUploadService } from '../../services/document-download/document-download.service';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';

@Component({
  selector: "upload-image-dialog",
  templateUrl: "upload-image.component.html"
})

export class UploadImageComponent implements OnInit {

  rfqId: number;
  projectId: number;
  materialId: number;
  subFileName: string;
  errorMessage: string;
  thumbnailImg: string;
  successfulUploads: number = 0;
  docs: FileList;
  finalImagesList: any;
  documentsName: string[] = [];
  prevDocsObj: ImageList[] = [];
  documentList: ImageList[] = [];
  prevDocumentList: ImageDocsLists[] = [];
  updatedDownloadList: ImageDocsLists[] = [];
  contractorImagesList: ImageDocsLists[] = [];
  supplierContractorImages: ImageList[] | ImageDocsLists[] = [];
  isDisplayErr: boolean;
  isEmptyImgList = false;

  constructor(
    private dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _uploadImageService: ImageService,
    private _documentUploadService: DocumentUploadService
  ) { }

  ngOnInit() {
    if(this.data.type === 'rfq'){
      this.rfqId = this.data.rfqId;
      this.materialId = this.data.selectedMaterial.materialId;
      this.getPrevUploadedRfqImages();
    }else if(this.data.type === 'supplier'){
      this.rfqId = Number(this.data.rfqId);
      this.materialId = this.data.selectedMaterial.materialId;
      this.prevDocumentList = this.data.prevUploadedImages.documentsList ? this.data.prevUploadedImages.documentsList.filter(elem => elem.supplierId) : [];
      this.getContractorImages();
    }else if(this.data.type === 'po'){
      this.getAllPOImages();
    }else{
      this.projectId = this.data.projectId;
      this.materialId = this.data.materialId;
      this.getUploadedImages();
    }
  }

  /**
   * @description function to get previous uploaded images for BOM, call when upload popup opens
   */
  getUploadedImages(){
    this._uploadImageService.getSelectedImages(this.projectId, this.materialId).then(res => {
      this.prevDocumentList = res.data;
    })
  }

  /**
   * @description function to get all contractor(rfq uploaded) images, call when upload popup opens 
   */
  getContractorImages(){
    this._uploadImageService.getRfqUploadedImages(this.rfqId, this.materialId).then(res => {
      this.contractorImagesList = res.data;
    })
  }

  /**
   * @description function to get all rfq previous uploads, call when upload popup opens 
   */
  getPrevUploadedRfqImages(){
      this._uploadImageService.getRfqUploadedImages(this.rfqId, this.materialId).then(res => {
        if(res.data){

          let rfqPrevImages: ImageDocsLists[] = [];

          this.data.selectedMaterial.documentList.forEach(prevImg => res.data.forEach(newImg => {
            if(prevImg.documentId === newImg.documentId){
              rfqPrevImages.push(newImg);
            }
          }));

          const newUploadedImageList = (this.data.selectedMaterial && this.data.selectedMaterial.documentList) ? this.data.selectedMaterial.documentList.filter(opt => opt.documentId === 0) : [];
          this.prevDocumentList = [...rfqPrevImages, ...newUploadedImageList];
        }
      });

  }

  /**
   * @description get all uploaded images of Purchase Order
   */
  getAllPOImages(){
    this._uploadImageService.getPOImages(this.data.purchaseOrderId, this.data.selectedMaterial.materialId).then(res => {
      this.prevDocumentList = res.data.filter(list => list.supplierId === null);
      this.contractorImagesList = res.data.filter(list => list.supplierId !== null);
    })
  }

  getFileSizeErr($event){
    this.errorMessage = $event;
  }

  /**
   * @description function calls when select a new file to upload, also checks file format,
   * and manage successful upload counts
   * @param files file object of upload file
   */
  fileUpdate(files: FileList) {

    const str = files[0].name;
    this.docs = files;
    const acceptedFormats = this.docs[0].type.split("/")[1];
    const acceptedFormatsArr = ["png", "jpg", "jpeg"];
    this.isDisplayErr = true;

    if((this.prevDocumentList && this.prevDocumentList.length > 0) && (this.documentList && this.documentList.length === 0)){
      this.successfulUploads = 0;
    }

    if((acceptedFormatsArr.indexOf(acceptedFormats) !== -1) && (FieldRegExConst.SPECIAL_CHARACTERS.test(str) === false)){
      this.successfulUploads++;
      this.errorMessage = "";
    }else{
      this.errorMessage = "File format should be .jpg, .jpeg, .png";
    }


    if((FieldRegExConst.SPECIAL_CHARACTERS.test(str) === false) 
      && this.docs 
      && (this.successfulUploads + (this.prevDocumentList ? this.prevDocumentList.length : 0)) <= ((this.data.type === 'rfq' || this.data.type === 'supplier' || this.data.type === 'po') ? 10 : 5) 
      && (acceptedFormats === 'png' || acceptedFormats === 'jpg' || acceptedFormats === 'jpeg')){
        
        this.errorMessage = '';
        this.uploadDocs();

    }else if((this.successfulUploads + (this.prevDocumentList ? this.prevDocumentList.length : 0)) > ((this.data.type === 'rfq' || this.data.type === 'supplier' || this.data.type === 'po') ? 10 : 5)){
      this.errorMessage = `You cannot upload more than ${(this.data.type === 'rfq' || this.data.type === 'supplier' || this.data.type === 'po') ? 10 : 5} images.`
      this.successfulUploads--;
    }else if(FieldRegExConst.SPECIAL_CHARACTERS.test(str) === true){
      this.errorMessage = "Filename should not include special characters";
    }
  }

  /**
   * @description function to upload images with valid filename and file format
   */
  uploadDocs() {
    if (this.docs && this.docs.length) {
      const data = new FormData();
      data.append(`file`, this.docs[0]);
      this.isEmptyImgList = true;
      this._documentUploadService.postDocumentUpload(data).then(res => {
        
        this.thumbnailImg = res.data.url;
        let firstName: number = res.data.fileName.indexOf("_");
        this.subFileName = res.data.fileName.substring(firstName + 1, res.data.fileName.length);
        this.documentsName.push(this.subFileName);

        // document object - created when new file uploads
        this.documentList.push({
          "documentShortUrl": res.data.fileName,
          "documentDesc": this.subFileName,
          "documentId": 0,
          "documentThumbnailUrl": res.data.ThumbnailUrl,
          "documentThumbnailShortUrl": res.data.ThumbnailFileName,
          "documentUrl": res.data.url
        });
      })
    }
  }

  
  /**
   * @description function will call when click on Add button in upload modal
   */
  addImage(){
    
    // if previous uploaded images exist then create a new object prevDocsObj with all mandatory fields
    if(this.prevDocumentList && this.prevDocumentList.length){
      this.prevDocumentList.forEach(img => {
        this.prevDocsObj.push({
          "documentShortUrl": img.documentShortUrl,
          "documentDesc": img.documentDesc,
          "documentId": img.documentId,
          "documentThumbnailUrl": img.documentThumbnailUrl,
          "documentThumbnailShortUrl": img.documentThumbnailShortUrl,
        });
      })
    }

    // final image list object - and combined both prev and new images list
    this.finalImagesList = {
      "projectId": this.data.type === 'rfq' ? this.data.selectedMaterial.projectId : this.projectId,
      "materialId": this.data.type === 'rfq' ? this.data.selectedMaterial.materialId : (this.data.type === 'po' ? this.data.selectedMaterial.materialId : this.materialId),
      "purchaseOrderId": this.data.type === 'po' ? this.data.purchaseOrderId : null,
      "documentsList": [...this.prevDocsObj, ...this.documentList],
    }

    // conditions for rfq, supplier and bom images to upload
    if(this.data.type === 'rfq'){
      this.dialogRef.close(this.finalImagesList);
    }else if(this.data.type === 'supplier'){
      this.documentList.map(list => {
        list.supplierId = Number(this.data.supplierId)
        list.materialId = this.materialId;
      });
      this.supplierContractorImages = [...(this.prevDocumentList ? this.prevDocumentList : []), ...this.documentList, ...(this.contractorImagesList ? this.contractorImagesList : [])]      
      this.dialogRef.close(this.supplierContractorImages);
    }else if(this.data.type === 'po'){

      this.finalImagesList.documentsList = [...this.finalImagesList.documentsList, ...this.contractorImagesList];

      return this._uploadImageService.uploadPOImage(this.finalImagesList).then(res => {
        this.dialogRef.close(this.finalImagesList);
      });
    }else{
      return this._uploadImageService.uploadImage(this.finalImagesList).then(res => {
        this.dialogRef.close('addImages');
      });
    }
  }
  
  /**
   * @description function will execute to delete an specific image
   * @param url image url which you wants to remove
   */
  removeImage(url: string){   
    // if any image removes, then error message which was displaying previously (error related to filename, file format duplicate file) should also remove
    this.errorMessage = "";
    this.isDisplayErr = false;
    this.isEmptyImgList = true;

    //get the length of prrevious uploads after delete a file
    if(this.prevDocumentList && this.prevDocumentList.length)
      this.prevDocumentList = this.prevDocumentList.filter(opt => opt.documentShortUrl !== url);

    //get the length of latest uploads after delete a file
    if(this.documentList && this.documentList.length)
      this.documentList = this.documentList.filter(opt => opt.documentShortUrl !== url);

    this.successfulUploads = this.documentList.length;
  }

  /**
   * @description function will execute to download specific image
   * @param fileName image short url
   * @param url image url, which you wants to download
   */
  downloadImage(fileName, url){
    const data = { fileName, url }
    this._uploadImageService.downloadImage(data).then(img => {
      var win = window.open(img.data.url, '_blank');
      win.focus();
    });
  }
  

  /**
   * @description function will call when click on close button of popup
   */
  closeDialog() {
    this.dialogRef.close(null);
  }
}