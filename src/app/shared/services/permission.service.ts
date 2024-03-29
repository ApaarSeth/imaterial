import { Injectable } from "@angular/core";
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
  }

  checkPermission(role: string) {
    if (role.toLowerCase() == "l1") {
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
    else if (role.toLowerCase() == "l2") {
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
      this.permissionObj.globalStoreFlag = false;
      this.permissionObj.rfqFlag = false;
      this.permissionObj.purchaseOrderFlag = false;
      this.permissionObj.usersFlag = false;
      this.permissionObj.supplierFlag = false;
      this.permissionObj.projectEdit = false;
      this.permissionObj.addProject = false;
    }
    return this.permissionObj;
  }
}
