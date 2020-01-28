export interface RfqProjects {
  rfqProjects: RfqProject[];
}

export interface RfqProjectSubmit {
  projectId: number;
  projectName: string;
  projectAddressId: number;
  addressId: number;
  supplierId: number;
  supplierAddressId: number;
  supplierName: string;
  rfqId: number;
  materialList: MaterialListSubmit[];
}

export interface MaterialListSubmit {
  materialId: number;
  materialQty: number;
  brandName: string;
  materialUnitPrice: number;
}
export interface RfqProject {
  projectId: number;
  userId: number;
  organizationId: number;
  projectName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  gstNo: string;
  addressType: string;
  addressShortname: string;
  type: string;
  area: number;
  cost: number;
  startDate: string;
  endDate: string;
  materialCount: number;
  openIndentCount: null;
  projectAddressId: number;
  primaryAddress: number;
  status: number;
  createdBy: string;
  createdAt: string;
  lowStockMaterialCount: string;
  purchaseOrderCount: string;
  purchaseOrderCost: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  imageUrl: null;
  rfqId: number;
  supplierId: number;
  supplierName: string;
  matCount: null;
  unit: null;
  materialList: RfqMaterialList[];
}

export interface RfqMaterialList {
  id: number;
  status: number;
  createdBy: string;
  createdAt: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  materialId: number;
  materialCode: string;
  projectId: number;
  materialName: string;
  materialGroup: string;
  materialUnit: number;
  materialCustomFlag: null;
  materialCustomId: null;
  materialSubGroup: string;
  requestedQuantity: number;
  materialSpecs: null;
  checked: boolean;
  materialQty: number;
  brandName: null;
  materialUnitPrice: number;
  estimatedQty: number;
  estimatedPrice: null;
  matCount: number;
  rfqMaterialQty: number;
  brandList: string[];
  supplierList: RfqSupplierList[];
  rfqSuppliers: null;
  brands: null;
}

export interface RfqSupplierList {
  rfqSupplierId: number;
  rfqId: number;
  supplierId: number;
  shortlistFlag: number;
  supplierName: string;
  brandDetailList: RfqBrandDetail[];
}

export interface RfqBrandDetail {
  brandName: string;
  materialUnitPrice: number;
}