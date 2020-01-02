import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';

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
  projectId: number;
  // categories: any;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.categories = new FormControl([]);
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
     })
  }

  demo() {
    this.selectedCategory = [...this.categories.value];
    console.log(this.categories.value);
  }
}
