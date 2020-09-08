import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { GlobalProject } from "src/app/shared/models/GlobalStore/projectWise";
import { CommonService } from 'src/app/shared/services/commonService';
import { GlobalStoreService } from 'src/app/shared/services/global-store.service';
import { IndentObj, ProjectMaterialObj } from 'src/app/shared/models/GlobalStore/materialWise';

@Component({
  selector: "app-project-wise",
  templateUrl: "./project-wise.component.html"
})

export class ProjectWiseComponent implements OnInit {

  @Input("projectData") projectData: GlobalProject[];
  @Output("projectDataLength") projectDataLength = new EventEmitter();
  searchProject: string = "";
  isMobile: boolean;
  indentList: IndentObj[];

  constructor(
    private commonService: CommonService,
    private _globalStoreService: GlobalStoreService
  ) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.projectDataLength.emit(this.projectData.length);
  }

  /**
   * @description get material's indent list after click on specific material row
   * @param materialObj 
   * @param event 
   */
  getIndentsList(materialObj: ProjectMaterialObj, event){
    if(event){
      this._globalStoreService.getMaterialIndents(materialObj.materialId).then(res => {
        if(res.data && res.data.length > 0){
          console.log(res.data);
          this.indentList = res.data;
          materialObj.isIndent = true;
        }
      });
    }
  }
}
