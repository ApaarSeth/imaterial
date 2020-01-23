import { Component, OnInit } from "@angular/core";
import {
  RfqMaterialResponse,
  AddRFQ
} from "src/app/shared/models/RFQ/rfq-details";
import { Router } from "@angular/router";

@Component({
  selector: "documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class DocumentsComponent implements OnInit {
  searchText: string = null;
  buttonName: string = "uploadDocuments";
  checkedMaterialsList: RfqMaterialResponse[];
  docs: FileList;
  rfqDetails: AddRFQ;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkedMaterialsList = history.state.checkedMaterialsList;
    console.log("checkedMaterialsList", this.checkedMaterialsList);
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

      for (let key in Object.keys(this.docs)) {
        fileArr.push(this.docs[key]);
        data.append(`files[${key}]`, this.docs[key]);
      }
      // data.append(`files`, fileArr);
      data.append("fileUploadType", "RFQ");
      console.log("asdxfcgvhbjnk", data);
      //data.append('parentId', this.item.itemForm.value.locationQtyList[0].attachId);
      // return this.commonService.docUpload(data).then(res => {
      //   return res;
      // });
    }
    // else {
    //   of().toPromise();
    // }
  }
  navigateToReviewRFQ() {
    let checkedMaterialsList = this.checkedMaterialsList;
    this.router.navigate(["/rfq/review"], {
      state: { checkedMaterialsList }
    });
  }
}
