import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { DocumentList, ImageList } from '../../models/PO/po-data';
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

  constructor(
    private dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _uploadImageService: DocumentUploadService,
  ) { }

  ngOnInit() {
    this.projectId = this.data.projectId;
    this.materialId = this.data.materialId;
  }

  fileUpdate(files: FileList) {
    this.docs = files;
    if(this.docs && this.docs.length <= 5){
      this.uploadDocs();
    }else{
      this.errorMessage = "You cannot upload more than 5 images."
    }
  }

  uploadDocs() {
    if (this.docs && this.docs.length) {
      const data = new FormData();
      data.append(`file`, this.docs[0]);
      let count = 0;
      // if(!(this.documentList.some(element => { return element.documentName == this.docs[0].name; }))){
          this._uploadImageService.postDocumentUpload(data).then(res => {
            
            let firstName: number = res.data.fileName.indexOf("_");
            this.subFileName = res.data.fileName.substring(firstName + 1, res.data.fileName.length);
            this.documentsName.push(this.subFileName);

            this.documentList.push({
              "DocumentUrl": res.data.fileName,
              "DocumentDesc": this.subFileName,
            });    
          })
      // }else{}
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
      console.log(res);
    });
  }

}