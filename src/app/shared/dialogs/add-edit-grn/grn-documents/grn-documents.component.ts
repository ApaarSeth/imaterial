import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  SimpleChanges,
  HostListener
} from "@angular/core";
import { first } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentList } from 'src/app/shared/models/PO/po-data';
import { DocumentUploadService } from 'src/app/shared/services/document-download.service';
@Component({
  selector: "grn-documents",
  templateUrl: "./grn-documents.component.html"
})
export class GRNDocumentsComponent implements OnInit {
  
  @Input("documentListLength") public documentListLength: number;
  @Input("documentData") documentData: DocumentList[];
  documentList: DocumentList[] = [];
  docs: FileList;
  urlReceived = false;
  documentsName: string[] = [];
  mode: string;
  filesRemoved: boolean;
  showResponsive: boolean;

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
    window.dispatchEvent(new Event('resize'));
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  fileUpdate(files: FileList) {
    // this.urlReceived = false;
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
        if (this.documentList.length < 4) {
          return this.documentUploadService.POSTSUPPLIERDOCUMENTUPLOAD(data).then(res => {
            this.filesRemoved = false;
            let name: string = res.data;
            let firstName: number = res.data.fileName.indexOf("_");
            let subFileName = res.data.fileName.substring(firstName + 1, res.data.fileName.length);
            this.documentsName.push(subFileName);
            this.documentList.push({
              documentType: "GRN",
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
            'Maximum 4 documents are allowed ',
            "",
            {
              duration: 4000,
              panelClass: ["warning-snackbar"],
              verticalPosition: "bottom"
            }
          );
        }
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

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (event.currentTarget.innerWidth >= 962) {
      this.showResponsive = true;
    } else {
      this.showResponsive = false;
    }
  }
}
