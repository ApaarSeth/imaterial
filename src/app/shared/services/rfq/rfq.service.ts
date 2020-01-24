import { Injectable } from "@angular/core";
//import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { ProjectIds } from "../../models/project-details";
import { RfqProjectSubmit } from "../../models/RFQ/rfqBids";
import { Suppliers } from "../../models/RFQ/suppliers";
import { AddRFQ } from "../../models/RFQ/rfq-details";

@Injectable({
  providedIn: "root"
})
export class RFQService {
  constructor(private dataService: DataService) {}

  rfqMaterials(ProjectIds: ProjectIds) {
    return this.dataService.sendPostRequest(API.RFQMATERIALS, {
      projectIds: ProjectIds
    });
  }
  rfqDetail(organizationId: number) {
    return this.dataService.getRequest(API.RFQDETAIL(organizationId));
  }
  rfqPo(organizationId: number, rfqId: number) {
    return this.dataService.getRequest(API.RFQPO(organizationId, rfqId));
  }
  rfqAddPo(bidData: RfqProjectSubmit[]) {
    console.log("bidData", bidData);
    return this.dataService.sendPostRequest(API.RFQADDPO, bidData);
  }
  getSuppliers(organizationId: number) {
    return this.dataService.getRequest(API.GETSUPPLIERS(organizationId));
  }

  addNewSupplier(organizationId: number, supplier: Suppliers) {
    return this.dataService
      .sendPostRequest(API.ADDSUPPLIER(organizationId), supplier)
      .then(res => {
        return res;
      });
  }

  addRFQ(rfqDetail: AddRFQ) {
    return this.dataService.sendPostRequest(API.ADDRFQ, rfqDetail).then(res => {
      return res;
    });
  }
}
