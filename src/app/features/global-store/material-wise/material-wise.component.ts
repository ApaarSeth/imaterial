import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { IndentObj, GlobalStoreObj } from "src/app/shared/models/GlobalStore/materialWise";
import { CommonService } from 'src/app/shared/services/commonService';
import { GlobalStoreService } from 'src/app/shared/services/global-store.service';

@Component({
  selector: "app-material-wise",
  templateUrl: "./material-wise.component.html"
})

export class MaterialWiseComponent implements OnInit {
  
  @Input("materialData") materialData: GlobalStoreObj[];
  @Output("materialDataLength") materialDataLength = new EventEmitter();
  isMobile: boolean;
  searchMaterial: string = "";
  indentList: IndentObj[];

  constructor(
    private commonService: CommonService,
    private _globalStoreService: GlobalStoreService
  ) { }
  
  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    console.log(this.materialData);
    this.materialDataLength.emit(this.materialData?.length);
  }

  getIndentsList(projectObj, event){
    if(event){
      this._globalStoreService.getMaterialIndents(projectObj.materialId).then(res => {
        if(res.data && res.data.length > 0){
          this.indentList = res.data;
          projectObj.isIndent = true;
        }
      });
    }
  }
}
