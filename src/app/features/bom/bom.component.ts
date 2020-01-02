import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-bom",
  templateUrl: "./bom.component.html",
  styleUrls: ["../../../assets/scss/pages/bom.scss"]
})
export class BomComponent implements OnInit {
  Object = Object;
  showTable = false;
  categories: FormControl;
  selectedCategory = [];
  value = "";
  fullCategoryList = {
    "0": {
      label: "category",
      estimatedQty: null,
      subcategory: {
        label: "subCategoryName",
        estimatedQty: null,
        material: [
          {
            label: "material1",
            estryqty: null
          },
          {
            label: "material1",
            estryqty: null
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
            label: "material1",
            estryqty: null
          },
          {
            label: "material1",
            estryqty: null
          }
        ]
      }
    }
  };

  projectId: number;
  searchText: string = null;
  // categories: any;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.categories = new FormControl([]);
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params["id"];
    });
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
