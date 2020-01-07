import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";

@Injectable({
  providedIn: "root"
})
export class BomService {
  constructor(private dataService: DataService) {}

  getMaterialsWithSpecs(categoryList) {
    return this.dataService.getRequestMaster(
      API.GETMATERIALSWITHSPECS,
      categoryList
    );
  }
  getMaterialWithQuantity(organizationId: Number, projectId: Number) {
    return this.dataService.getRequestMaster(
      API.GETMATERIALSWITHQUANTITY(organizationId, projectId)
    );
  }
  getCategory() {
    return this.dataService.getRequestMaster(API.GETCATERGORY).then(res => {
      return res;
    });
  }
}
