import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectDetails } from "src/app/shared/models/project-details";

@Component({
  selector: "app-bom-preview",
  templateUrl: "./bom-preview.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class BomPreviewComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}
  projectId: number;
  product: any;
  @Input("selectedCategory") selectedCategory;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params["id"];
    });
    this.product = history.state.projectDetails;
    console.log("selectedCategory");
    console.log(this.selectedCategory);
  }

  getMaterialLength(cat) {
    console.log(cat);
    if (cat.subcategory.material.length) {
      console.log(cat);
      return true;
    }
    return false;
  }
  saveCategory() {
    let projectDetails = this.product;
    this.router.navigate(["/bom/" + this.projectId + "/bom-detail"], {
      state: { projectDetails }
    });
  }
}
