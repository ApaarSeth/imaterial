import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { API } from "../constants/configuration-constants";

@Injectable({
  providedIn: "root"
})

export class GlobalStoreService {

  constructor(private dataService: DataService) { }

  getMaterialWiseData(pageNo, pageSize) {
    return this.dataService.getRequest(API.GLOBAL_STORE_MATERIAL_WISE(pageNo, pageSize));
  }

  getProjectWiseData(organizationId) {
    return this.dataService.getRequest(API.GETPROJECTWISE(organizationId));
  }

  getMaterialIndents(materialId){
    return this.dataService.getRequest(API.GET_ALL_INDENTS_LIST(materialId));
  }
}