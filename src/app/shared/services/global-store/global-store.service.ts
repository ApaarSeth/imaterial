import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";

@Injectable({
  providedIn: "root"
})
export class GlobalStoreService {
  constructor(private dataService: DataService) {}
  getMaterialWiseData(organizationId) {
    return this.dataService.getRequest(API.GETMATERIALWISE(organizationId));
  }
  getProjectWiseData(organizationId) {
    return this.dataService.getRequest(API.GETPROJECTWISE(organizationId));
  }
}
