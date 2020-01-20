import { Component, OnInit } from "@angular/core";

export interface Project {
  materialName: string;
  quantity: number;
  makes: string[];
}

const Project_DATA: Project[] = [
  {
    materialName: "Steel 43 MM",
    quantity: 1500,
    makes: ["Brand Name", "Brand Name", "Brand Name", "Brand Name"]
  },
  {
    materialName: "Steel 43 MM",
    quantity: 1500,
    makes: ["Brand Name", "Brand Name", "Brand Name", "Brand Name"]
  },
  {
    materialName: "Steel 43 MM",
    quantity: 1500,
    makes: ["Brand Name", "Brand Name", "Brand Name", "Brand Name"]
  },
  {
    materialName: "Steel 43 MM",
    quantity: 1500,
    makes: ["Brand Name", "Brand Name", "Brand Name", "Brand Name"]
  },
  {
    materialName: "Steel 43 MM",
    quantity: 1500,
    makes: ["Brand Name", "Brand Name", "Brand Name", "Brand Name"]
  }
];

@Component({
  selector: "review",
  templateUrl: "./review.component.html",
  styles: ["../../../../assets/scss/main.scss"]
})
export class ReviewComponent implements OnInit {
  displayedColumns: string[] = ["Material Name", "Quantity", "Makes"];

  dataSource = Project_DATA;

  ngOnInit() {}
}
