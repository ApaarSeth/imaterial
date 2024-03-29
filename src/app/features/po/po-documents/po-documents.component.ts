import {
  Component,
  OnInit,
  Input,
  SimpleChanges
} from "@angular/core";
import { DocumentUploadService } from "src/app/shared/services/document-download.service";
import { DocumentList } from "src/app/shared/models/PO/po-data";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

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
  filesRemoved: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private documentUploadService: DocumentUploadService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mode = params.mode;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
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
      if (!(this.documentList.some(element => {
        return element.documentName == this.docs[0].name;
      }))) {
        return this.documentUploadService.postDocumentUpload(data).then(res => {
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
      else {
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

  getData() {
    if (this.documentList) {
      return this.documentList;
    }
  }

  removeFile(i) {
    this.documentList.splice(i, 1);
    this.documentsName.splice(i, 1);
    this.documentListLength = this.documentList.length;
    this.filesRemoved = true;
  }

  openFileUrl(url: string) {
    this.router.navigate([url]);
  }
}
