import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {GlobalStoreMaterial} from "src/app/shared/models/GlobalStore/materialWise";
import {GlobalProject} from "src/app/shared/models/GlobalStore/projectWise";

@Component({
  selector: "app-project-wise",
  templateUrl: "./project-wise.component.html",
  styleUrls: ["./project-wise.component.scss"]
})
export class ProjectWiseComponent implements OnInit {
  @Input("projectData") projectData: GlobalProject[];
  @Output("projectDataLength") projectDataLength = new EventEmitter();
  newProjectData: GlobalProject[];
  searchProject: string = "";
  constructor() {}

  ngOnInit() {
    this.mappingMaterialData();
  }

  mappingMaterialData() {
    this.newProjectData = this.projectData.map((project: GlobalProject) => {
      let projects: GlobalProject[] = [];
      let recentDateProject: string;
      let nearDueDate: string;
      for (let material of project.GlobalMaterials) {
        let totalSum = 0;
        let sum = 0;
        if (material.IndentMaterial) {
          for (let indentMaterial of material.IndentMaterial) {
            if (!nearDueDate) {
              nearDueDate = indentMaterial.dueDate;
            } else {
              if (new Date(indentMaterial.dueDate) > new Date(nearDueDate)) {
                nearDueDate = indentMaterial.dueDate;
              }
            }
            sum += indentMaterial.quantity;
          }
        }
        material.GlobalMaterial.sum = sum;
        material.GlobalMaterial.nearDueDate = nearDueDate;
      }
      return project;
    });
    this.projectDataLength.emit(this.newProjectData.length);
  }
}
