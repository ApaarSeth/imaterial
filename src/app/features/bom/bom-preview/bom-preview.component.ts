import { Component, OnInit, Input, ViewChild } from "@angular/core";

@Component({
  selector: "app-bom-preview",
  templateUrl: "./bom-preview.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class BomPreviewComponent implements OnInit {
  constructor() {}

  @Input("selectedCategory") selectedCategory;
  ngOnInit() {
    console.log(this.selectedCategory);
  }

  getMaterialLength(cat) {
    if (cat.subcategory.material.length) {
      console.log(cat);
      return true;
    }
    return false;
  }
}
