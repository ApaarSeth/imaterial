import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { initiatePo, SupplierAddress } from "../../models/PO/po-data";
import { AllSupplierDetails } from "../../models/supplier";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class POService {
  constructor(private dataService: DataService) { }

  projectRole$ = new Subject();
  billingRole$ = new Subject();
  billingAddress$ = new Subject();
  supplierAddress$ = new Subject();
  poNumber$ = new Subject();

  // getPODetails(organizationId: Number) {
  //   return this.dataService.getRequest(API.GETPODETAILLIST(organizationId));
  // }

  getPODetails(data) {
    return this.dataService.sendPostRequest(API.POSTPODETAILLIST, data);
  }
  getPoGenerateData(poId: Number) {
    return this.dataService.getRequest(API.GETPODATA(poId));
  }

  sendPoData(poData) {
    return this.dataService.sendPostRequest(API.SENDPODATA, poData);
  }
  getApproverData(organizationId: number, projectId: number) {
    return this.dataService.getRequest(API.GETAPPROVER(organizationId, projectId));
  }
  projectMaterials(projectIds: number) {
    return this.dataService.sendPostRequest(API.RFQMATERIALS, {
      projectIds: [ projectIds ]
    });
  }

  initiatePo(initiatePoData: initiatePo[]) {
    return this.dataService.sendPostRequest(API.RFQADDPO, initiatePoData);
  }

  approveRejectPo(poStatusData) {
    return this.dataService.sendPostRequest(API.APPROVEREJECTPO, poStatusData);
  }

  getSupplierAddress(supplierId: Number) {
    return this.dataService.getRequest(API.GETSUPPLIERADDRESS(supplierId));
  }

  addAddress(supplierId: Number, address: SupplierAddress) {
    return this.dataService.sendPostRequest(API.ADDSUPPLIERADDRESS(supplierId), address);
  }

  getNumberToWords(currency: number) {
    return this.dataService.getRequest(API.NUMBERTOWORDS(currency));
  }
  downloadPo(purchaseOrderId) {
    return this.dataService.getRequest(API.DOWNLOADPO(purchaseOrderId));
  }
  paymentRecord(poId, data) {
    return this.dataService.sendPostRequest(API.PAYMENTRECORD(poId), data)
  }
  paymentHistory(poId) {
    return this.dataService.getRequest(API.PAYMENTHISTORY(poId))
  }
  paymentDetail(poId) {
    return this.dataService.getRequest(API.PAYMENTDETAIL(poId))
  }

  submitSupplierRating(data) {
    return this.dataService.sendPostRequest(API.SUPPLIER_RATING, data)
  }

  getCopyPo(poId: number) {
    return this.dataService.getRequest(API.COPYPO(poId))
  }

  shortClose(poId: number) {
    return this.dataService.getRequest(API.SHORTCLOSE(poId))
  }

  postPOExport(data) {
    return this.dataService.sendPostRequest(API.POSTPOEXPORTREQUEST, data).then(res => {
      return res;
    });
  }

}
