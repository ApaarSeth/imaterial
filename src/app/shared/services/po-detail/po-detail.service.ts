import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";

@Injectable({
  providedIn: "root"
})
export class PODetailService {
  constructor(private dataService: DataService) {}

  getPODetails(organizationId: Number) {
    return this.dataService.getRequest(API.GETPODETAILLIST(organizationId));
  }
}
