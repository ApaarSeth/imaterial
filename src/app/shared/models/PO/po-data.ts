export interface POData {
  supplierAddress: SupplierAddress;
  projectAddress: ProjectAddress;
  billingAddress: BillingAddress;
  materialData: PoMaterial[];
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  poNumber: number;
  poName: string;
  poValidUpto: string;
  DocumentsList: DocumentList[];
  Terms: terms;
  comments: string;
  projectId: number;
  approverId?: number;
  DocumentData?: FormData[];
}
export interface PoMaterial {
  materialId: number;
  materialCode: string;
  projectId: number;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  estimatedQty: number;
  estimatedRate: number;
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
  id: number;
  status: number;
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
  email: string;
  contactNo: string;
  firstName: string;
  lastName: string;
  projectUserId: number;
}
export interface BillingAddress {
  projectAddressId: number;
  supplierId: number;
  projectName: string;
  companyName: string;
  addressId: number;
  primaryAddress: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  email: string;
  contactNo: string;
  firstName: string;
  lastName: string;
  projectBillingUserId: number;
  projectBillingAddressId: number;
  gstNo: number;
}

export interface CardData {
  supplierAddress: SupplierAddress;
  projectAddress: ProjectAddress;
  billingAddress: BillingAddress;
  poNumber: number;
  poValidUpto: string;
  projectId: number;
}

export interface DocumentList {
  documentType: string;
  documentDesc: string;
  documentUrl: string;
  documentName?: string;
}

export interface ApproverData {
  id: number;
  status: number;
  created_by: string;
  created_at: string;
  last_updated_by: string;
  last_updated_at: string;
  userId: number;
  userType: string;
  organizationId: number;
  accountOwner: number;
  email: string;
  contactNo: number;
  countryCode: string;
  uniqueCode: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  accountStatus: number;
}

export interface initiatePo {
  projectId: number;
  projectName: string;
  projectAddressId: number;
  addressId: number;
  supplierId: number;
  supplierAddressId: number;
  supplierName: string;
  rfqId: null;
  materialList: poMaterialList[];
}

export interface poMaterialList {
  materialId: number;
  materialQty: number;
  brandNames: string[];
  materialUnitPrice: number;
}
