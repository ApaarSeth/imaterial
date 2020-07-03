import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { DocumentList } from '../../models/PO/po-data';
import { DocumentUploadService } from '../../services/document-download/document-download.service';

@Component({
  selector: "upload-image-dialog",
  templateUrl: "upload-image.component.html"
})

export class UploadImageComponent implements OnInit {

  @Input("documentListLength") public documentListLength: number;
  @Input("documentData") documentData: DocumentList[];
  docs: FileList;
  documentList: DocumentList[] = [];
  documentsName: string[] = [];
  filesRemoved: boolean;

  constructor(
    private dialogRef: MatDialogRef<UploadImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _uploadImageService: DocumentUploadService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  fileUpdate(files: FileList) {
    this.docs = files;
    this.uploadDocs();
  }

  uploadDocs() {
    if (this.docs && this.docs.length) {
      const data = new FormData();
      const fileArr: File[] = [];
      data.append(`file`, this.docs[0]);
      if(!(this.documentList.some(element => {
       return element.documentName == this.docs[0].name;
      }))){
          return this._uploadImageService.postDocumentUpload(data).then(res => {
        this.filesRemoved = false;
        let name: string = res.data;
        let firstName: number = res.data.fileName.indexOf("_");
        let subFileName = res.data.fileName.substring(firstName + 1, res.data.fileName.length);
        this.documentsName.push(subFileName);
        this.documentList.push({
          documentType: "PO",
          DocumentDesc: subFileName,
          DocumentUrl: res.data.fileName,
          documentName: subFileName,
          Url: res.data.url
        });
        this.documentListLength = this.documentList.length;
        subFileName = "";
        this.filesRemoved = true;
        
        this._snackBar.open("File has been successfully uploaded", "", {
            duration: 2000,
            panelClass: ["success-snackbar"],
            verticalPosition: "bottom"
          });
    
      }).catch(err => {
        this.filesRemoved = true;
        this.docs = null;
        this._snackBar.open(
          err.error.message,
          "",
          {
            duration: 4000,
            panelClass: ["warning-snackbar"],
            verticalPosition: "bottom"
          }
        );
      });
      }
      else{
         this._snackBar.open(
         'Duplicate files are not allowed',
          "",
          {
            duration: 4000,
            panelClass: ["warning-snackbar"],
            verticalPosition: "bottom"
          }
        );
      }
    }
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  addImage(){
    
  }

}