import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { DocumentList, ImageList, ImageDocsLists } from '../../models/PO/po-data';

import { ImageService } from '../../services/image-integration/image.service';
import { DocumentUploadService } from '../../services/document-download/document-download.service';

@Component({
  selector: "upload-image-dialog",
  templateUrl: "upload-image.component.html"
})

export class UploadImageComponent implements OnInit {

  docs: FileList;
  documentList: ImageList[] = [];
  prevDocumentList: ImageDocsLists[] = [];
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

  constructor(
    private dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _uploadImageService: ImageService,
    private _documentUploadService: DocumentUploadService
  ) { }

  ngOnInit() {
    this.projectId = this.data.projectId;
    this.materialId = this.data.materialId;
    // this.prevDocumentList = this.data.documentsList;
    this.getUploadedImages();
  }

  getUploadedImages(){
    this._uploadImageService.getSelectedImages(this.projectId, this.materialId).then(res => {
      this.prevDocumentList = res.data;
    })
  }

  fileUpdate(files: FileList) {
    this.docs = files;
    const acceptedFormats = this.docs[0].type.split("/")[1];
    const acceptedFormatsArr = ["png", "jpg", "jpeg"];

    if(this.countUploads){
      this.successfulUploads = 0;
    }

    if(acceptedFormatsArr.indexOf(acceptedFormats) !== -1)
      this.successfulUploads++;
      this.countUploads ? this.countUploads++ : this.countUploads;

    if(this.docs && (this.countUploads ? this.countUploads : (this.successfulUploads + (this.prevDocumentList ? this.prevDocumentList.length : 0))) <= 5 && (acceptedFormats === 'png' || acceptedFormats === 'jpg' || acceptedFormats === 'jpeg')){
      this.uploadDocs();
      this.errorMessage = '';
    }else if((this.countUploads ? this.countUploads : (this.successfulUploads + (this.prevDocumentList ? this.prevDocumentList.length : 0))) > 5){
      this.errorMessage = "You cannot upload more than 5 images."
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
          "documentUrl": res.data.fileName,
          "documentDesc": this.subFileName,
          "documentId": 0,
          "documentThumbnailUrl": res.data.ThumbnailUrl,
          "documentThumbnailShortUrl": res.data.ThumbnailFileName,
        });
      })
    }
  }

  
  addImage(){
    
    if(this.prevDocumentList && this.prevDocumentList.length){
      this.prevDocumentList.forEach(img => {
        this.prevDocsObj.push({
          "documentUrl": img.documentShortUrl,
          "documentDesc": img.documentDesc,
          "documentId": img.documentId,
          "documentThumbnailUrl": img.documentThumbnailUrl,
          "documentThumbnailShortUrl": img.documentThumbnailShortUrl,
        });
      })
    }

    this.finalImagesList = {
      "projectId": this.projectId,
      "materialId": this.materialId,
      "documentsList": [...this.prevDocsObj, ...this.documentList],
    }
    
    return this._uploadImageService.uploadImage(this.finalImagesList).then(res => {
      this.dialogRef.close('addImages');
    });
  }
  
  removeImage(url: string){    
    this.prevDocumentList = this.prevDocumentList.filter(opt => opt.documentDesc !== url);
    this.documentList = this.documentList.filter(opt => opt.documentDesc !== url);
    this.countUploads = this.prevDocumentList.length + this.documentList.length;
  }

  downloadImage(fileName, url){
    const data = { fileName, url }
    this._uploadImageService.downloadImage(data).then(img => {
      var win = window.open(img.data.url, '_blank');
      win.focus();
    });
  }
  
  closeDialog() {
    this.dialogRef.close(null);
  }
}