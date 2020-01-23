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
  makes?: string[];
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
  rfq_name: string;
  due_date: Date;
  rfq_status: string;
  suppliers_id: number[];
  project_address_id: number;
  rfqProjectsList: RfqMaterialResponse[];
  documentsList: DocumentDetails[];
  terms: Terms;
}

export interface DocumentDetails {
  documentType: string;
  documentDesc: string;
  documentUrl: string;
}

export interface Terms {
  termsDesc: string;
  termsType: "RFQ";
}
