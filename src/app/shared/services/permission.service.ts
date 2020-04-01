import { Injectable } from "@angular/core";
//import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { isThisTypeNode } from "typescript";
import { permission } from '../models/permissionObject';

@Injectable({
  providedIn: "root"
})
export class PermissionService {
  private role: string;
  permissionObj: permission = {
    projectStoreFlag: false,
    globalStoreFlag: false,
    rfqFlag: false,
    purchaseOrderFlag: false,
    usersFlag: false,
    supplierFlag: false,
    projectEdit: false,
    addProject: false,
    poApprovalFlag: false
  };

  constructor() {
    this.role = localStorage.getItem("role");
  }

  checkPermission() {
    if (this.role == "l1") {
      this.permissionObj.projectStoreFlag = true;
      this.permissionObj.globalStoreFlag = true;
      this.permissionObj.rfqFlag = true;
      this.permissionObj.purchaseOrderFlag = true;
      this.permissionObj.usersFlag = true;
      this.permissionObj.supplierFlag = true;
      this.permissionObj.projectEdit = true;
      this.permissionObj.addProject = true;
      this.permissionObj.poApprovalFlag = true;
    }
    else if (this.role == "l1" || this.role == "l2") {
      this.permissionObj.projectStoreFlag = true;
      this.permissionObj.globalStoreFlag = true;
      this.permissionObj.rfqFlag = true;
      this.permissionObj.purchaseOrderFlag = true;
      this.permissionObj.usersFlag = true;
      this.permissionObj.supplierFlag = true;
      this.permissionObj.projectEdit = true;
      this.permissionObj.addProject = true;
    }

    else {
      this.permissionObj.projectStoreFlag = true;
    }
    return this.permissionObj;
  }
}
