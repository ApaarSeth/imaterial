import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { ProjectDetails } from "src/app/shared/models/project-details";
import { FormControl } from "@angular/forms";

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

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
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
    console.log(this.selectedProjects);
  }
  // demo(groupName) {
  //   // if (!this.categoryList.includes(groupName)) {
  //   //   this.categoryList.push(groupName);
  //   // }
  //   this.selectedProjects = [...this.selectedProjects, ...this.projects.value];
  //   console.log(this.projects.value);
  // }
}
