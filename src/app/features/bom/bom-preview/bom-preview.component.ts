import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-bom-preview",
  templateUrl: "./bom-preview.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class BomPreviewComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}
  projectId: number;
  // product: ProjectDetails;
  @Input("selectedCategory") selectedCategory;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params["id"];
    });
    console.log("selectedCategory");
    console.log(this.selectedCategory);
    // console.log(this.selectedCategory);
    //this.getProject(this.projectId);
  }

  getMaterialLength(cat) {
    console.log(cat);
    if (cat.subcategory.material.length) {
      console.log(cat);
      return true;
    }
    return false;
  }

  getData() {
    const data = this.selectedCategory.Child.map(child => {
      const {
        materialCode,
        materialName,
        materialGroup,
        materialUnit,
        estimatedQty,
        estimatedRate
      } = child;

      return {
        materialCode,
        materialName,
        materialGroup,
        materialUnit,
        estimatedQty: Number(estimatedQty),
        estimatedRate
      };
    }).filter(inputData => inputData.estimatedQty);
    return data;
  }

  // getProject(id: number){
  //   this.projectService.getProject(1,id).then(data => {
  //     this.product = data.message;
  // });
  // }

  saveCategory() {
    this.router.navigate(["/bom/" + this.projectId + "/bom-detail"]);
  }
}
