import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { GlobalProject } from "src/app/shared/models/GlobalStore/projectWise";
import { CommonService } from 'src/app/shared/services/commonService';

@Component({
  selector: "app-project-wise",
  templateUrl: "./project-wise.component.html",
  styleUrls: [ "./project-wise.component.scss" ]
})

export class ProjectWiseComponent implements OnInit {
  @Input("projectData") projectData: GlobalProject[];
  @Output("projectDataLength") projectDataLength = new EventEmitter();
  newProjectData: GlobalProject[];
  searchProject: string = "";
  isMobile: boolean;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.mappingMaterialData();
  }

  mappingMaterialData() {
    this.newProjectData = this.projectData.map((project: GlobalProject) => {
      // let projects: GlobalProject[] = [];
      // let recentDateProject: string;

      for (let material of project.GlobalMaterials) {
        // let totalSum = 0;
        let sum = 0;
        let nearDueDate: string = null;
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
