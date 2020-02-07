import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { DocumentUploadService } from "src/app/shared/services/document-download/document-download.service";
import { DocumentList } from "src/app/shared/models/PO/po-data";
import { first } from 'rxjs/operators';

@Component({
  selector: "app-po-documents",
  templateUrl: "./po-documents.component.html",
  styleUrls: ["./po-documents.component.scss"]
})
export class PoDocumentsComponent implements OnInit {
  @Input('documentListLength') public documentListLength : number;
  documentList: DocumentList[] = [];
  docs: FileList;
  urlReceived = false;
  documentsName: string[] = [];
  constructor(private documentUploadService: DocumentUploadService) {}

  ngOnInit() {}

  fileUpdate(files: FileList) {
    // this.urlReceived = false;
    this.docs = files;
    console.log("docs", this.docs);
    this.uploadDocs();
  }

  uploadDocs() {
    if (this.docs && this.docs.length) {
      const data = new FormData();

      const fileArr: File[] = [];

      data.append(`file`, this.docs[0]);
      console.log("asdxfcgvhbjnk", data);
      return this.documentUploadService.postDocumentUpload(data).then(res => {
        console.log(res);
        let name: string = res.data;
        let firstName : number = name.lastIndexOf("/");
        let lastName :number = name.indexOf("?Expires");
        let subFileName = name.substring(firstName+1, lastName);

        this.documentsName.push(subFileName);
        

        this.documentList.push({
          documentType: "PO",
          documentDesc: "abc",
          documentUrl: res.data,
          documentName:subFileName
        });
        this.documentListLength = this.documentList.length;
        subFileName = "";
      });
    }
    console.log(this.documentList);
  }

  getData() {
    if (this.documentList) {
      return this.documentList;
    }
  }

  removeFile(i) {
    this.documentList.splice(i, 1);
    this.documentsName.splice(i, 1);
    this.documentListLength = this.documentList.length;
  }
}
