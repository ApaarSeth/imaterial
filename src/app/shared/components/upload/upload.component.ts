import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild } from "@angular/core";
import { DocumentDetails } from "../../models/RFQ/rfq-details";
import { DocumentUploadService } from "../../services/document-download/document-download.service";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html"
})
export class UploadComponent implements OnInit {
  fileToUpload: FileList;
  @Input("grnResponsive") public grnResponsive: boolean;
  @Input() documentListLength: number;
  fileTypes : string[] = ['pdf', 'doc', 'docx', 'jpeg', 'png', 'jpg'];
  imgFileTypes : string[] = ['jpeg', 'png', 'jpg'];

  deletedDocs: number[] = [];
  uploadedDocs: DocumentDetails[];

  @Output("onFileUpdate") onFileUpdate = new EventEmitter<FileList>();
  @Input() parentId;
  @Input() label;
  @Input("filesRemoved") filesRemoved: boolean;
  @Input('updateInfo') userInfo: boolean;
  @ViewChild('fileDropRef', { static: false }) myInputVariable: ElementRef;
  @Input() imageIntegration: boolean;
  @Input() errorMessage: boolean;
  @Output() fileSizeErr = new EventEmitter<string>();

  constructor(private documentUploadService: DocumentUploadService,
    private _snackBar:MatSnackBar
    ) { }

  ngOnInit(): void { }
    
  /**
   * This function is used to add document to a particular RFQ Item
   * @param files Document to be upload
   */

  ngOnChanges(): void {
    if (this.filesRemoved) {
      this.myInputVariable.nativeElement.value = "";
      this.fileToUpload = this.myInputVariable.nativeElement.value;
    }

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }



  uploadFiles(files: FileList) {
    let newFiles = new DataTransfer();
    let filesize = files[0].size;
    let fileType = files[0].name.split('.').pop();
    //.pdf, .doc, .docx, .jpeg, .png
    // let filetype = files[0].type;
     if(filesize < 5000000){
     
       if(this.fileTypes.some(element => {
         return element === fileType
       })){
             Object.keys(files).forEach(key => {
            newFiles.items.add(files[key]);
          });

          if (this.fileToUpload) {
            Object.keys(this.fileToUpload).forEach(key => {
              newFiles.items.add(this.fileToUpload[key]);
            });
          }
          this.fileToUpload = newFiles.files;
          this.onFileUpdate.emit(this.fileToUpload);

          // If same file upload in image integration twice then this code will work
          if(this.imageIntegration){
            this.myInputVariable.nativeElement.value = "";
            this.fileToUpload = this.myInputVariable.nativeElement.value;
          }
       }
       else{
           this._snackBar.open("We don't support "+fileType+" in Document upload, Please uplaod pdf, doc, docx, jpeg, png", "", {
            duration: 2000,
            panelClass: ["success-snackbar"],
            verticalPosition: "bottom"
          });
       }
           
      }
      else{

        /** If upload image is greater than 5 mb then it will check nested condition (if file extension matches accepted file format or not) **/
        if(this.imageIntegration){
          if(this.imgFileTypes.indexOf(fileType) === -1)
            this.fileSizeErr.emit("File format should be .jpg, .jpeg, .png");

          else
            this.fileSizeErr.emit("File should be less than 5 MB");
        }else{
          this._snackBar.open("File must be less than 5 mb", "", {
           duration: 2000,
           panelClass: ["success-snackbar"],
           verticalPosition: "bottom"
         });
        }
      }
  
  }

  uploadDocs(
    fileUploadType: string = null,
    fileLIst: FileList = this.fileToUpload
  ): Promise<any> {
    if (fileLIst && fileLIst.length) {
      const data = new FormData();

      const fileArr: File[] = [];

      for (let key in Object.keys(fileLIst)) {
        fileArr.push(fileLIst[key]);
        data.append(`files[${key}]`, fileLIst[key]);
      }
    } else {
      return Promise.resolve();
    }
  }

  reset() {
    const newFiles = new DataTransfer();
    this.fileToUpload = newFiles.files;
    this.deletedDocs = [];
    this.uploadedDocs = [];
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
