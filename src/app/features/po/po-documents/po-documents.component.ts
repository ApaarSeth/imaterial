import { Component, OnInit } from "@angular/core";
import { DocumentUploadService } from "src/app/shared/services/document-download/document-download.service";
import { DocumentList } from "src/app/shared/models/PO/po-data";

@Component({
  selector: "app-po-documents",
  templateUrl: "./po-documents.component.html",
  styleUrls: ["./po-documents.component.scss"]
})
export class PoDocumentsComponent implements OnInit {
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
        this.documentsName.push(
          res.data
            .split("")
            .splice(res.data.lastIndexOf("/") + 1, res.data.length - 1)
            .join("")
        );
        this.documentList.push({
          documentType: "PO",
          documentDesc: "abc",
          documentUrl: res.data
        });
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
  }
}