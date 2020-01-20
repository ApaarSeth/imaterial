import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import {
  ProjectDetails,
  ProjectIds
} from "src/app/shared/models/project-details";
import { FormControl } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { stringify } from "querystring";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";

@Component({
  selector: "rfq",
  templateUrl: "./project-materials.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class RFQProjectMaterialsComponent implements OnInit {
  userId: 1;
  searchText: string = null;

  allProjects: ProjectDetails[];
  buttonName: string = "projectMaterials";
  projects: FormControl;
  selectedProjects = [];
  ProjectIds: ProjectIds;
  rfqDetails: RfqMaterialResponse[];

  displayedColumns: string[] = [
    "Material Name",
    "Required Date",
    "Requested Quantity",
    "Estimated Quantity"
  ];

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService
  ) {}

  ngOnInit() {
    this.allProjects = this.activatedRoute.snapshot.data.rfq;
    this.projects = new FormControl([]);
    console.log("projectList", this.allProjects);
  }
  setButtonName(name: string) {
    this.buttonName = name;
  }
  setSelectedProjectList() {
    console.log("list", this.projects.value);
    console.log(
      this.selectedProjects.map(selectedProject => selectedProject.projectId)
    );
    this.ProjectIds = this.selectedProjects.map(
      selectedProject => selectedProject.projectId
    ) as ProjectIds;
    this.rfqMaterials(this.ProjectIds);
  }

  rfqMaterials(projectIds: ProjectIds) {
    this.rfqService.rfqMaterials(projectIds).then(res => {
      this.rfqDetails = res.data;
      console.log("qwertyuio", this.rfqDetails);
    });
  }
}
