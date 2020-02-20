import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  SimpleChanges
} from "@angular/core";
import { DocumentUploadService } from "src/app/shared/services/document-download/document-download.service";
import { DocumentList } from "src/app/shared/models/PO/po-data";
import { first } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-po-documents",
  templateUrl: "./po-documents.component.html"
})
export class PoDocumentsComponent implements OnInit {
  @Input("documentListLength") public documentListLength: number;
  @Input("documentData") documentData: DocumentList[];
  documentList: DocumentList[] = [];
  docs: FileList;
  urlReceived = false;
  documentsName: string[] = [];
  mode: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private documentUploadService: DocumentUploadService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mode = params.mode;
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("documentList", this.documentData);
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

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
        let firstName: number = name.lastIndexOf("/");
        let lastName: number = name.indexOf("?Expires");
        let subFileName = name.substring(firstName + 1, lastName);

        this.documentsName.push(subFileName);

        this.documentList.push({
          documentType: "PO",
          documentDesc: "abc",
          documentUrl: res.data,
          documentName: subFileName
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

  openFileUrl(i) {
    this.router.navigate([this.documentData[i].documentUrl]);
  }
}
