import { Component, OnInit, Input } from "@angular/core";
import { getLocaleTimeFormat } from "@angular/common";
import {
  GlobalStoreMaterial,
  GlobalProject
} from "src/app/shared/models/GlobalStore/materialWise";

@Component({
  selector: "app-material-wise",
  templateUrl: "./material-wise.component.html",
  styleUrls: ["./material-wise.component.scss"]
})
export class MaterialWiseComponent implements OnInit {
  @Input("materialData") materialData: GlobalStoreMaterial[];
  newMaterialData: GlobalStoreMaterial[];
  constructor() {}

  ngOnInit() {
    console.log(this.materialData);
    this.mappingMaterialData();
    console.log(this.newMaterialData);
  }

  mappingMaterialData() {
    this.newMaterialData = this.materialData.map(
      (material: GlobalStoreMaterial) => {
        let projects: GlobalProject[] = [];
        let recentDateProject: Date;
        let totalSum = 0;
        for (let project of material.GlobalProject) {
          let sum = 0;
          let nearDueDate: Date;
          if (project.IndentMaterial) {
            for (let indent of project.IndentMaterial) {
              if (!nearDueDate) {
                nearDueDate = new Date(indent.dueDate);
              } else {
                if (
                  new Date(indent.dueDate).getTime() > nearDueDate.getTime()
                ) {
                  nearDueDate = new Date(indent.dueDate);
                }
              }
              sum += indent.quantity;
            }
          }
          project = {
            ...project,
            Projects: {
              ...project.Projects,
              sum: sum,
              nearDueDate: nearDueDate.toDateString(),
              indentMaterials: project.IndentMaterial
            }
          };
          projects.push(project);
        }
        for (let proj of projects) {
          totalSum += proj.Projects.sum;
          if (!recentDateProject) {
            recentDateProject = new Date(proj.Projects.nearDueDate);
          } else {
            if (
              proj.Projects.nearDueDate &&
              new Date(proj.Projects.nearDueDate).getTime() >
                recentDateProject.getTime()
            ) {
              recentDateProject = new Date(proj.Projects.nearDueDate);
            }
          }
        }
        return {
          GlobalMaterial: {
            ...material.GlobalMaterial,
            sum: totalSum,
            nearDueDate: recentDateProject,
            availableQuantity: null
          },
          GlobalProject: projects
        };
      }
    );
  }
}
