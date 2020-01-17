import { Component, OnInit } from "@angular/core";

@Component({
  selector: "documents",
  templateUrl: "./documents.component.html",
  styles: ["../../../../assets/scss/main.scss"]
})
export class DocumentsComponent implements OnInit {
  searchText: string = null;
  buttonName: string = "uploadDocuments";

  ngOnInit() {}
}
