import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Location }from "@angular/common";

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
  // fullCategoryList = {
  //   "0": {
  //     label: "category",
  //     estimatedQty: null,
  //     subcategory: {
  //       label: "subCategoryName",
  //       estimatedQty: null,
  //       material: [
  //         {
  //           label: "material1",
  //           estryqty: null
  //         },
  //         {
  //           label: "material1",
  //           estryqty: null
  //         }
  //       ]
  //     }
  //   },
  //   "1": {
  //     label: "category",
  //     estimatedQty: null,
  //     subcategory: {
  //       label: "subCategoryName",
  //       estimatedQty: null,
  //       material: [
  //         {
  //           label: "material1",
  //           estryqty: null
  //         },
  //         {
  //           label: "material1",
  //           estryqty: null
  //         }
  //       ]
  //     }
  //   }
  // };

  projectId: number;
  searchText: string = null;
  product: any;
  fullCategoryList: any;
  constructor(private activatedRoute: ActivatedRoute,private location :Location) {}

  ngOnInit() {
    this.categories = new FormControl([]);
    this.fullCategoryList = this.activatedRoute.snapshot.data.bomCategory
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params["id"];
    });
    this.product = history.state.projectDetails;
  }

  demo() {
    this.selectedCategory = [...this.categories.value];
    console.log(this.selectedCategory)
    //console.log(this.categories.value);
  }

  finalisedCategory() {
    this.showTable = true;
    //console.log(this.showTable);
  }

  editProject(projectId: number){
  }

  deleteProject(){
  }
}
