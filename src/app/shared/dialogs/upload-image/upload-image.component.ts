import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { DocumentList, ImageList } from '../../models/PO/po-data';

import { ImageService } from '../../services/image-integration/image.service';
import { DocumentUploadService } from '../../services/document-download/document-download.service';

@Component({
  selector: "upload-image-dialog",
  templateUrl: "upload-image.component.html"
})

export class UploadImageComponent implements OnInit {

  docs: FileList;
  documentList: ImageList[] = [];
  documentsName: string[] = [];
  filesRemoved: boolean;
  projectId: number;
  materialId: number;
  subFileName: string;
  errorMessage: string;
  thumbnailImg: string;
  successfulUploads: number = 0;

  constructor(
    private dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _uploadImageService: ImageService,
    private _documentUploadService: DocumentUploadService
  ) { }

  ngOnInit() {
    this.projectId = this.data.projectId;
    this.materialId = this.data.materialId;
  }

  fileUpdate(files: FileList) {
    this.docs = files;
    const acceptedFormats = this.docs[0].type.split("/")[1];
    const acceptedFormatsArr = ["png", "jpg", "jpeg"];

    if(acceptedFormatsArr.indexOf(acceptedFormats) !== -1)
      this.successfulUploads++;

    if(this.docs && this.successfulUploads <= 5 && (acceptedFormats === 'png' || acceptedFormats === 'jpg' || acceptedFormats === 'jpeg')){
      this.uploadDocs();
      this.errorMessage = '';
    }else if(this.successfulUploads > 5){
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
          "DocumentUrl": res.data.fileName,
          "DocumentDesc": this.subFileName,
          "imageUrl": this.thumbnailImg
        });    
      })
    }
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  addImage(){
    const data = {
      "projectId": this.projectId,
      "materialId": this.materialId,
      "documentsList": this.documentList
    }

    return this._uploadImageService.uploadImage(data).then(res => {
      this.dialogRef.close('closed');
    });
  }

}