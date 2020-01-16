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
        this.mappingIndentToProject(material);
        this.mappingProjectToMaterial(material);
        return material;
      }
    );
  }

  mappingProjectToMaterial(material: GlobalStoreMaterial) {
    let recentDateProject: string;
    let totalSum = 0;
    for (let proj of material.GlobalProject) {
      totalSum += proj.Projects.sum;
      if (!recentDateProject) {
        recentDateProject = proj.Projects.nearDueDate;
      } else {
        if (
          proj.Projects.nearDueDate &&
          new Date(proj.Projects.nearDueDate) > new Date(recentDateProject)
        ) {
          recentDateProject = proj.Projects.nearDueDate;
        }
      }
    }
    material.GlobalMaterial.sum = totalSum;
    material.GlobalMaterial.nearDueDate = recentDateProject;
  }

  mappingIndentToProject(material: GlobalStoreMaterial) {
    for (let project of material.GlobalProject) {
      let sum = 0;
      let nearDueDate: string;
      if (project.IndentMaterial) {
        for (let indent of project.IndentMaterial) {
          if (!nearDueDate) {
            nearDueDate = indent.dueDate;
          } else {
            if (new Date(indent.dueDate) > new Date(nearDueDate)) {
              nearDueDate = indent.dueDate;
            }
          }
          sum += indent.quantity;
        }
      }
      project.Projects.sum = sum;
      project.Projects.nearDueDate = nearDueDate;
      project.Projects.indentMaterials = project.IndentMaterial;
    }
  }
}
