export interface POData {
  supplierAddress: SupplierAddress;
  projectAddress: ProjectAddress;
  materialData: PoMaterial[];
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  poNumber: number;
  poName: null;
  poValidUpto: null;
  DocumentsList: null;
  Terms: terms;
}
export interface PoMaterial {
  materialId: number;
  materialCode: string;
  projectId: number;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  estimatedQty: number;
  estimatedRate: null;
  materialCustomFlag: number;
  materialCustomId: number;
  materialSubGroup: string;
  materialSpecs: string;
  requestedQuantity: number;
  checked: boolean;
  issueToProject: number;
  availableStock: number;
  indentDetailList: null;
  purchaseOrderDetailList: PurchaseOrder[];
}

export interface PurchaseOrder {
  id: 0;
  status: 0;
  created_by: string;
  created_at: string;
  last_updated_by: string;
  last_updated_at: string;
  projectName: string;
  addressId: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  materialId: number;
  materialBrand: string;
  materialQuantity: number;
  materialUnit: string;
  materialUnitPrice: number;
  materialIgst: number;
  materialSgst: number;
  materialCgst: number;
}
export interface terms {
  termsDesc: string;
  termsType: string;
}

export interface SupplierAddress {
  supplierAddressId: number;
  supplierId: number;
  supplierName: string;
  contactNo: string;
  email: string;
  addressId: number;
  primaryAddress: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  gstNo: string;
}

export interface ProjectAddress {
  projectAddressId: number;
  supplierId: number;
  projectName: string;
  addressId: number;
  primaryAddress: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface CardData {
  supplierAddress: SupplierAddress;
  projectAddress: ProjectAddress;
  poNumber: number;
  poValidUpto: null;
}
