import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-bom",
  templateUrl: "./bom.component.html",
  styleUrls: ["../../../assets/scss/pages/bom.scss"]
})
export class BomComponent implements OnInit {
  categoryList = ["category", "category", "category", "category", "category"];
  categories: FormControl;
  selectedCategory = [];
  value = "";
  // categories: any;
  constructor() {}

  ngOnInit() {
    this.categories = new FormControl([]);
  }

  demo() {
    this.selectedCategory = [...this.categories.value];
    console.log(this.categories.value);
  }
}
