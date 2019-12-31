import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-bom",
  templateUrl: "./bom.component.html",
  styleUrls: ["../../../assets/scss/pages/bom.scss"]
})
export class BomComponent implements OnInit {
  Object = Object;
  showTable = false;
  fullCategoryList = {
    "0": {
      label: "category",
      estimatedQty: null,
      subcategory: {
        label: "subCategoryName",
        estimatedQty: null,
        material: [
          {
            0: {
              label: "material1",
              estryqty: null
            },
            1: {
              label: "material1",
              estryqty: null
            }
          }
        ]
      }
    },
    "1": {
      label: "category",
      estimatedQty: null,
      subcategory: {
        label: "subCategoryName",
        estimatedQty: null,
        material: [
          {
            0: {
              label: "material1",
              estryqty: null
            },
            1: {
              label: "material1",
              estryqty: null
            }
          }
        ]
      }
    }
  };
  categoryList = this.fullCategoryList[0];
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

  finalisedCategory() {
    this.showTable = true;
    console.log(this.showTable);
  }
}
