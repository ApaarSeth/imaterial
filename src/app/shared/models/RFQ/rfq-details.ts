import { Suppliers } from "./suppliers";

export interface RfqMaterialResponse {
  projectId?: number;
  projectName?: string;
  defaultAddress?: Address;
  projectMaterialList?: RfqMat[];
  projectAddressList?: Address[];
  prevMatListLength?: number;
}
export interface RfqMat {
  projectId?: number;
  materialId?: number;
  materialName?: string;
  requestedQty?: number;
  estimatedQty?: number;
  dueDate?: Date;
  checked?: boolean;
  quantity?: number;
  estimatedRate?: number;
  fullfilmentDate?: string;
  // to do change name makes to brands
  makes?: string[];
  materialUnit?: string;
}
export interface Address {
  projectId?: number;
  projectName?: string;
  addressID?: number;
  addressShortname?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
  gstNo?: string;
  addressType?: string;
  projectAddressId: number;
  projectdefaultAddressId: number;
  primaryAddress: number;
}

export interface RfqList {
  rfqId: number;
  rfqName: string;
  rfqDueDate: Date;
  projectCount: number;
  supplierCount: number;
  materialCount: number;
  rfqStatus: number;
  supplierList: null;
  createdAt: Date;
}

export interface AddRFQ {
  id: number;
  status: number;
  createdBy: string;
  createdAt: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  rfqId: number;
  rfq_status: string;
  rfqName: string;
  dueDate: Date;
  supplierId: number[];
  supplierDetails: Suppliers[];
  rfqProjectsList: RfqMaterialResponse[];
  documentsList: DocumentDetails[];
  selectBuildsupplyAsSupplier?: boolean
  terms: Terms;
}

export interface DocumentDetails {
  documentType: string;
  documentDesc: string;
  documentUrl: string;
}

export interface Terms {
  termsId?: number;
  termsDesc: string;
  termsType: string;
  otherDesc?: string;
}
