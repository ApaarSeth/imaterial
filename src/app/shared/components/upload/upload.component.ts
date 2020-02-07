import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { DocumentDetails } from "../../models/RFQ/rfq-details";
import { DocumentUploadService } from "../../services/document-download/document-download.service";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html"
})
export class UploadComponent implements OnInit {
  fileToUpload: FileList;
  @Input() documentListLength: number;

  deletedDocs: number[] = [];
  uploadedDocs: DocumentDetails[];

  @Output("onFileUpdate") onFileUpdate = new EventEmitter<FileList>();
  @Input() parentId;
  @Input() label;
  @Input() filesUploaded;

  constructor(private documentUploadService: DocumentUploadService) {}

  ngOnInit(): void {}

  /**
   * This function is used to add document to a particular RFQ Item
   * @param files Document to be upload
   */
  uploadFiles(files: FileList) {
    let newFiles = new DataTransfer();

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
