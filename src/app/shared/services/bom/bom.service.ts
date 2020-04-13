import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { sendIssuedQuantityObj } from "../../models/issue-to-indent";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class BomService {
  constructor(private dataService: DataService) { }

  searchText = new Subject<string>();


  getMaterialsWithSpecs(categoryList) {
    return this.dataService.getRequestMaster(
      API.GETMATERIALSWITHSPECS,
      categoryList
    );
  }
  getMaterialWithQuantity(organizationId: Number, projectId: Number) {
    return this.dataService.getRequest(
      API.GETMATERIALSWITHQUANTITY(organizationId, projectId)
    );
  }
  getCategory() {
    return this.dataService.getRequestMaster(API.GETCATERGORY).then(res => {
      return res;
    });
  }

  get25Trades(tradeList) {
    return this.dataService.getRequestMaster(API.GET25BOMTRADES, tradeList)
  }

  getTrades(tradeList) {
    return this.dataService.getRequestMaster(API.GETBOMTRADES, tradeList)
  }

  sumbitCategory(userId: number, projectId: number, materialsQuantity) {
    return this.dataService.sendPostRequest(
      API.POSTMATERIALSQUANTITY(userId, projectId),
      materialsQuantity
    );
  }
  getIssueToIndent(materialId: number, projectId: number) {
    return this.dataService.getRequest(
      API.GETISSUETOINDENT(materialId, projectId)
    );
  }
  postIssueToIndent(
    materialId: number,
    indentDetailList: sendIssuedQuantityObj[]
  ) {
    return this.dataService
      .sendPostRequest(API.POSTISSUETOINDENT(materialId), indentDetailList)
      .then(res => {
        return res;
      });
  }
  postMaterialExcel(data: FormData, projectId: number) {
    return this.dataService.sendPostRequest(API.UPLOADEXCEL(projectId), data)
  }

  deleteMaterial(materialId: number, projectId: number) {
    return this.dataService.sendDeleteRequest(API.DELETEMATERIAL(projectId, materialId), {})
  }

  getOrgTrades(projectId) {
    return this.dataService.getRequest(API.ORGANIZATIONTRADES(projectId))
  }
  setProjTrades(tradeData) {
    return this.dataService.sendPostRequest(API.PROJECTTRADES, tradeData)
  }

  getMaterialUnit() {
    return this.dataService.getRequest(API.MATERIALUNIT)
  }

  getTradeCategory(tradeName) {
    return this.dataService.getRequestMaster(API.TRADERELATEDCATEGORY(tradeName))
  }

  getMaterialExist(data) {
    return this.dataService.sendPostRequest(API.MATERIALEXIST, data)
  }

}
