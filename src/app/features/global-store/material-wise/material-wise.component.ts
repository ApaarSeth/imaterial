import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IndentObj, GlobalStoreObj, ProjectMaterialObj } from "src/app/shared/models/GlobalStore/materialWise";
import { CommonService } from 'src/app/shared/services/commonService';
import { GlobalStoreService } from 'src/app/shared/services/global-store.service';
import { PaginatorConfig } from 'src/app/shared/models/common.models';

@Component({
  selector: "app-material-wise",
  templateUrl: "./material-wise.component.html"
})

export class MaterialWiseComponent implements OnInit {
  
  @Input("materialData") materialData: GlobalStoreObj[];
  @Input() pageNumber: number;
  @Input() pageLimit: number;
  @Input() totalPageCount: number;
  @Output("materialDataLength") materialDataLength = new EventEmitter();
  @Output() sendMaterialPaginationInfo = new EventEmitter<any>();
  isMobile: boolean;
  searchMaterial: string = "";
  indentList: IndentObj[];
  paginationConfig: PaginatorConfig;

  constructor(
    private commonService: CommonService,
    private _globalStoreService: GlobalStoreService
  ) { }
  
  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.materialDataLength.emit(this.materialData?.length);
    this.paginationConfig = {
      limit: this.pageLimit,
      pageNumber: this.pageNumber,
      totalCount: this.totalPageCount
    }
  }

  /**
   * @description get material's indent list after click on specific project row
   * @param projectObj 
   * @param event 
   */
  getIndentsList(projectObj: ProjectMaterialObj, event){
    if(event){
      this._globalStoreService.getMaterialIndents(projectObj.materialId).then(res => {
        if(res.data && res.data.length > 0){
          this.indentList = res.data;
          projectObj.isIndent = true;
        }
      });
    }
  }

  updatePaginatorOptions(data){
    this.sendMaterialPaginationInfo.emit(data);
  }
}