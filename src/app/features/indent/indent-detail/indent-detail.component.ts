import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import { ProjectDetails } from "src/app/shared/models/project-details";

export interface IndentData {
  indentName: string;
  requestedDate: number;
  totalNoOfMaterial: number;
  createdBy: string;
  date: number;
}

const ELEMENT_DATA: IndentData[] = [
  {
    indentName: "Steelbar 15MM",
    requestedDate: 22 / 2 / 2020,
    totalNoOfMaterial: 43,
    createdBy: "Rahul Singh",
    date: 22 / 2 / 2020
  },
  {
    indentName: "Steelbar 15MM",
    requestedDate: 22 / 2 / 2020,
    totalNoOfMaterial: 43,
    createdBy: "Rahul Singh",
    date: 22 / 2 / 2020
  },
  {
    indentName: "Steelbar 15MM",
    requestedDate: 22 / 2 / 2020,
    totalNoOfMaterial: 43,
    createdBy: "Rahul Singh",
    date: 22 / 2 / 2020
  },
  {
    indentName: "Steelbar 15MM",
    requestedDate: 22 / 2 / 2020,
    totalNoOfMaterial: 43,
    createdBy: "Rahul Singh",
    date: 22 / 2 / 2020
  },
  {
    indentName: "Steelbar 15MM",
    requestedDate: 22 / 2 / 2020,
    totalNoOfMaterial: 43,
    createdBy: "Rahul Singh",
    date: 22 / 2 / 2020
  },
  {
    indentName: "Steelbar 15MM",
    requestedDate: 22 / 2 / 2020,
    totalNoOfMaterial: 43,
    createdBy: "Rahul Singh",
    date: 22 / 2 / 2020
  },
  {
    indentName: "Steelbar 15MM",
    requestedDate: 22 / 2 / 2020,
    totalNoOfMaterial: 43,
    createdBy: "Rahul Singh",
    date: 22 / 2 / 2020
  },
  {
    indentName: "Steelbar 15MM",
    requestedDate: 22 / 2 / 2020,
    totalNoOfMaterial: 43,
    createdBy: "Rahul Singh",
    date: 22 / 2 / 2020
  },
  {
    indentName: "Steelbar 15MM",
    requestedDate: 22 / 2 / 2020,
    totalNoOfMaterial: 43,
    createdBy: "Rahul Singh",
    date: 22 / 2 / 2020
  },
  {
    indentName: "Steelbar 15MM",
    requestedDate: 22 / 2 / 2020,
    totalNoOfMaterial: 43,
    createdBy: "Rahul Singh",
    date: 22 / 2 / 2020
  }
];

@Component({
  selector: "app-indent-detail",
  templateUrl: "./indent-detail.component.html",
  styleUrls: ["./indent-detail.component.scss"]
})
export class IndentDetailComponent implements OnInit {
  product: ProjectDetails;
  projectId: number;
  displayedColumns: string[] = [
    "Indent Name",
    "Requested Date",
    "Total No Of Material",
    "Created By",
    "Date"
  ];
  dataSource = ELEMENT_DATA;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params["id"];
    });
    this.getProject(this.projectId);
  }
  getProject(id: number) {
    this.projectService.getProject(1, id).then(data => {
      this.product = data.message;
    });
  }
  editProject() {}
  deleteProject() {}
}
