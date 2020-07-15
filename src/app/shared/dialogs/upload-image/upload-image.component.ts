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

  docs: FileList;
  documentList: ImageList[] = [];
  prevDocumentList: ImageDocsLists[] = [];
  contractorImagesList: ImageDocsLists[] = [];
  supplierContractorImages: ImageList[] | ImageDocsLists[] = [];
  documentsName: string[] = [];
  filesRemoved: boolean;
  projectId: number;
  materialId: number;
  subFileName: string;
  errorMessage: string;
  thumbnailImg: string;
  successfulUploads: number = 0;
  prevDocsObj: ImageList[] = [];
  finalImagesList: any;
  countUploads: number;
  rfqId: number;

  constructor(
    private dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _uploadImageService: ImageService,
    private _documentUploadService: DocumentUploadService
  ) { }

  ngOnInit() {
    if(this.data.type === 'rfq'){
      this.prevDocumentList = this.data.selectedMaterial.documentList;
    }else if(this.data.type === 'supplier'){
      this.rfqId = Number(this.data.rfqId);
      this.materialId = this.data.selectedMaterial.materialId;
      this.prevDocumentList = this.data.prevUploadedImages.documentsList ? this.data.prevUploadedImages.documentsList.filter(elem => elem.supplierId) : [];
      this.getContractorImages();
    }else{
      this.projectId = this.data.projectId;
      this.materialId = this.data.materialId;
      this.getUploadedImages();
    }
  }

  getUploadedImages(){
    this._uploadImageService.getSelectedImages(this.projectId, this.materialId).then(res => {
      this.prevDocumentList = res.data;
    })
  }

  getContractorImages(){
    this._uploadImageService.getRfqUploadedImages(this.rfqId, this.materialId).then(res => {
      this.contractorImagesList = res.data;
    })
  }

  fileUpdate(files: FileList) {

    const str = files[0].name;
    this.docs = files;
    const acceptedFormats = this.docs[0].type.split("/")[1];
    const acceptedFormatsArr = ["png", "jpg", "jpeg"];

    if(this.countUploads){
      this.successfulUploads = 0;
    }

    if((acceptedFormatsArr.indexOf(acceptedFormats) !== -1) && (FieldRegExConst.SPECIAL_CHARACTERS.test(str) === true)){
      this.successfulUploads++;
      this.countUploads ? this.countUploads++ : this.countUploads;
    }

    if(this.data.type === 'rfq' || this.data.type === 'supplier'){
      if((FieldRegExConst.SPECIAL_CHARACTERS.test(str) === true) && this.docs && (this.countUploads ? this.countUploads : (this.successfulUploads + (this.prevDocumentList ? this.prevDocumentList.length : 0))) <= 3 && (acceptedFormats === 'png' || acceptedFormats === 'jpg' || acceptedFormats === 'jpeg')){

        if(this.prevDocumentList && this.prevDocumentList.length){
          this.prevDocumentList.forEach(file => {
            if(file.documentDesc !== this.docs[0].name){
              this.uploadDocs();
            }
          });
        }else{
          this.uploadDocs();
        }

        this.errorMessage = '';
      }else if((this.countUploads ? this.countUploads : (this.successfulUploads + (this.prevDocumentList ? this.prevDocumentList.length : 0))) > 3){
        this.errorMessage = "You cannot upload more than 3 images."
      }else if(FieldRegExConst.SPECIAL_CHARACTERS.test(str) === false){
        this.errorMessage = "Filename should not include special characters";
      }
    }else{
      if((FieldRegExConst.SPECIAL_CHARACTERS.test(str) === true) && this.docs && (this.countUploads ? this.countUploads : (this.successfulUploads + (this.prevDocumentList ? this.prevDocumentList.length : 0))) <= 5 && (acceptedFormats === 'png' || acceptedFormats === 'jpg' || acceptedFormats === 'jpeg')){
        this.uploadDocs();
        this.errorMessage = '';
      }else if((this.countUploads ? this.countUploads : (this.successfulUploads + (this.prevDocumentList ? this.prevDocumentList.length : 0))) > 5){
        this.errorMessage = "You cannot upload more than 5 images."
      }else if(FieldRegExConst.SPECIAL_CHARACTERS.test(str) === false){
        this.errorMessage = "Filename should not include special characters";
      }
    }
    
  }

  uploadDocs() {
    if (this.docs && this.docs.length) {
      const data = new FormData();
      data.append(`file`, this.docs[0]);
      this._documentUploadService.postDocumentUpload(data).then(res => {
        
        this.thumbnailImg = res.data.url;

        let firstName: number = res.data.fileName.indexOf("_");
        this.subFileName = res.data.fileName.substring(firstName + 1, res.data.fileName.length);
        this.documentsName.push(this.subFileName);

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

  
  addImage(){
    
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

    this.finalImagesList = {
      "projectId": this.data.type === 'rfq' ? this.data.selectedMaterial.projectId : this.projectId,
      "materialId": this.data.type === 'rfq' ? this.data.selectedMaterial.materialId : this.materialId,
      "documentsList": [...this.prevDocsObj, ...this.documentList],
    }

    if(this.data.type === 'rfq'){
      this.dialogRef.close(this.finalImagesList);
    }else if(this.data.type === 'supplier'){
      this.documentList.map(list => {
        list.supplierId = Number(this.data.supplierId)
        list.materialId = this.materialId;
      });
      this.supplierContractorImages = [...(this.prevDocumentList ? this.prevDocumentList : []), ...this.documentList, ...(this.contractorImagesList ? this.contractorImagesList : [])]

      console.log("supplierUploadedImages", this.supplierContractorImages)
      
      this.dialogRef.close(this.supplierContractorImages);
    }else{
      return this._uploadImageService.uploadImage(this.finalImagesList).then(res => {
        this.dialogRef.close('addImages');
      });
    }
  }
  
  removeImage(url: string){   
    if(this.prevDocumentList && this.prevDocumentList.length)
      this.prevDocumentList = this.prevDocumentList.filter(opt => opt.documentDesc !== url);

    if(this.documentList && this.documentList.length)
      this.documentList = this.documentList.filter(opt => opt.documentDesc !== url);

    this.countUploads = (this.prevDocumentList ? this.prevDocumentList.length : 0) + (this.documentList ? this.documentList.length : 0);
  }

  downloadImage(fileName, url){
    const data = { fileName, url }
    this._uploadImageService.downloadImage(data).then(img => {
      // if(this.data.type === 'supplier'){
        // var win = window.open(img.data.fileName, '_blank');  
      // }else{
        var win = window.open(img.data.url, '_blank');
      // }
      win.focus();
    });
  }
  
  closeDialog() {
    this.dialogRef.close(null);
  }
}