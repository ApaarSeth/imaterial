import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { GlobalStoreMaterial } from "src/app/shared/models/GlobalStore/materialWise";
import { CommonService } from 'src/app/shared/services/commonService';
import { GlobalStoreService } from 'src/app/shared/services/global-store.service';

@Component({
  selector: "app-material-wise",
  templateUrl: "./material-wise.component.html"
})

export class MaterialWiseComponent implements OnInit {
  
  @Input("materialData") materialData: GlobalStoreMaterial[];
  @Output("materialDataLength") materialDataLength = new EventEmitter();
  isMobile: boolean;
  searchMaterial: string = "";
  // newMaterialData: GlobalStoreMaterial[];
  // searchProject: string = "";

  constructor(
    private commonService: CommonService,
    private _globalStoreService: GlobalStoreService
  ) { }
  
  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    console.log(this.materialData);
    this.materialDataLength.emit(this.materialData?.length);
    // this.mappingMaterialData();
  }

  getIndentsList(materialId){
    this._globalStoreService.getMaterialIndents(materialId).then(res => {
      console.log(res);
    })
  }

  // mappingMaterialData() {
  //   this.newMaterialData = this.materialData.map((material: GlobalStoreMaterial) => {
  //     this.mappingIndentToProject(material);
  //     this.mappingProjectToMaterial(material);
  //     return material;
  //   });
  //   this.materialDataLength.emit(this.newMaterialData.length);
  // }

  // mappingProjectToMaterial(material: GlobalStoreMaterial) {
  //   let recentDateProject: string;
  //   let totalSum = 0;
  //   for (let proj of material.GlobalProject) {
  //     totalSum += proj.Projects.sum;
  //     if (!recentDateProject) {
  //       recentDateProject = proj.Projects.nearDueDate;
  //     } else {
  //       if (proj.Projects.nearDueDate && new Date(proj.Projects.nearDueDate) > new Date(recentDateProject)) {
  //         recentDateProject = proj.Projects.nearDueDate;
  //       }
  //     }
  //   }
  //   material.GlobalMaterial.sum = totalSum;
  //   material.GlobalMaterial.nearDueDate = recentDateProject;
  // }

  // mappingIndentToProject(material: GlobalStoreMaterial) {
  //   for (let project of material.GlobalProject) {
  //     let sum = 0;
  //     let nearDueDate: string = null;
  //     if (project.IndentMaterial) {
  //       for (let indent of project.IndentMaterial) {
  //         if (!nearDueDate) {
  //           nearDueDate = indent.dueDate;
  //         } else {
  //           if (new Date(indent.dueDate) > new Date(nearDueDate)) {
  //             nearDueDate = indent.dueDate;
  //           }
  //         }
  //         sum += indent.quantity;
  //       }
  //     }
  //     project.Projects.sum = sum;
  //     project.Projects.nearDueDate = nearDueDate;
  //     project.Projects.indentMaterials = project.IndentMaterial;
  //   }
  // }
}
