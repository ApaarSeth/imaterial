import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";

@Injectable({
  providedIn: "root"
})
export class POService {
  constructor(private dataService: DataService) {}

  getPODetails(organizationId: Number) {
    return this.dataService.getRequest(API.GETPODETAILLIST(organizationId));
  }
  getPoGenerateData(poId: Number) {
    return this.dataService.getRequest(API.GETPODATA(poId));
  }

  sendPoData(poData) {
    return this.dataService.sendPostRequest(API.SENDPODATA, poData);
  }
  getApproverData(organizationId: number, projectId: number) {
    return this.dataService.getRequest(
      API.GETAPPROVER(organizationId, projectId)
    );
  }
}
