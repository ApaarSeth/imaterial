import { Injectable } from "@angular/core";
//import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { ProjectIds } from "../../models/project-details";
import { RfqProjectSubmit } from "../../models/RFQ/rfqBids";
import { Suppliers } from "../../models/RFQ/suppliers";
import { AddRFQ } from "../../models/RFQ/rfq-details";
import { SendRfqObj } from "../../models/RFQ/rfq-details-supplier";

@Injectable({
  providedIn: "root"
})
export class RFQService {
  constructor(private dataService: DataService) { }
  mat = new Subject()
  stepperIndex = new BehaviorSubject(null)
  rfqMaterials(ProjectIds: number[], skipLoader?: boolean) {
    return this.dataService.sendPostRequest(API.RFQMATERIALS, {
      skipLoader: skipLoader,
      projectIds: ProjectIds
    });
  }

  // rfqDetail(organizationId: number) {
  //   return this.dataService.getRequest(API.RFQDETAIL(organizationId));
  // }

  rfqDetail(organisationId: number, data) {
    return this.dataService.sendPostRequest(API.RFQDETAIL(organisationId), data);
  }

  rfqPo(organizationId: number, rfqId: number) {
    return this.dataService.getRequest(API.RFQPO(organizationId, rfqId));
  }

  rfqAddPo(bidData: RfqProjectSubmit[]) {
    return this.dataService.sendPostRequest(API.RFQADDPO, bidData);
  }



  addNewSupplier(organizationId: number, supplier: Suppliers) {
    return this.dataService.sendPostRequest(API.ADDSUPPLIER(organizationId), supplier).then(res => {
      return res;
    });
  }

  addRFQ(rfqDetail: AddRFQ, skipLoader?: boolean) {
    return this.dataService.sendPostRequest(API.ADDRFQ, rfqDetail, { skipLoader });
  }

  getRFQDetailSupplier(rfqId: number, supplierId: number) {
    return this.dataService.getRequest(API.GETRFQDETAILSUPPLIER(rfqId, supplierId));
  }

  postRFQDetailSupplier(supplierId: number, rfqSupplierDetails: SendRfqObj) {
    return this.dataService.sendPostRequest(API.POSTRFQDETAILSUPPLIER(supplierId), rfqSupplierDetails).then(res => {
      return res;
    });
  }

  postRFQExport(organisationId, data) {
    return this.dataService.sendPostRequest(API.POSTRFQEXPORTREQUEST(organisationId), data).then(res => {
      return res;
    });
  }

  deleteSuplier(supplierId: number) {
    return this.dataService.sendDeleteRequest(API.DELETESUPPLIER(supplierId), {}).then(res => {
      return res;
    });
  }

  getRFQView(rfqId: number) {
    return this.dataService.getRequest(API.GETRFQVIEW(rfqId)).then(res => {
      return res;
    });
  }

  getGeneratedRfq(rfqId: number) {
    return this.dataService.getRequest(API.GETGENERATEDRFQ(rfqId));
  }

  getRfqTerms() {
    return this.dataService.getRequest(API.GETRFQTERMS);
  }

  postSupplierExcel(data: FormData, organisationId: number) {
    return this.dataService.sendPostRequest(API.UPLOADSUPPLIEREXCEL(organisationId), data)
  }

  getDraftRfq(rfqId: number) {
    return this.dataService.getRequest(API.GETADDEDRFQ(rfqId));
  }

  getCurrency() {
    return this.dataService.getRequest(API.CURRENCY);
  }
}
