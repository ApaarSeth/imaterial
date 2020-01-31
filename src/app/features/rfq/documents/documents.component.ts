import { Component, OnInit } from "@angular/core";
import {
  RfqMaterialResponse,
  AddRFQ
} from "src/app/shared/models/RFQ/rfq-details";
import { Router } from "@angular/router";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { DocumentUploadService } from "src/app/shared/services/document-download/document-download.service";
import { DocumentList } from "src/app/shared/models/PO/po-data";

@Component({
  selector: "documents",
  templateUrl: "./documents.component.html",
  styleUrls: [
    "../../../../assets/scss/main.scss"
    // "../../../../../node_modules/froala-editor/css/froala_editor.pkgd.min.css",
    // "../../../../../node_modules/froala-editor/css/froala_style.min.css"
  ]
})
export class DocumentsComponent implements OnInit {
  searchText: string = null;
  buttonName: string = "uploadDocuments";
  checkedMaterialsList: RfqMaterialResponse[];
  selectedSuppliersList: Suppliers[];
  documentList: DocumentList[] = [];
  documentsName: string[] = [];
  docs: FileList;
  rfqDetails: AddRFQ;

  constructor(
    private router: Router,
    private documentUploadService: DocumentUploadService
  ) {}

  ngOnInit() {
    this.checkedMaterialsList = history.state.checkedMaterialsList;
    this.selectedSuppliersList = history.state.selectedSuppliersList;
    console.log("checkedMaterialsList", this.checkedMaterialsList);
    console.log("selectedSuppliersList", this.selectedSuppliersList);
  }

  setButtonName(name: string) {
    this.buttonName = name;
  }

  fileUpdate(files: FileList) {
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

  removeFile(i) {
    this.documentList.splice(i, 1);
  }
  navigateToReviewRFQ() {
    let checkedMaterialsList = this.checkedMaterialsList;
    let selectedSuppliersList = this.selectedSuppliersList;
    let documentsList = this.documentList;
    console.log(checkedMaterialsList);
    this.router.navigate(["/rfq/review"], {
      state: { checkedMaterialsList, selectedSuppliersList, documentsList }
    });
  }
}
