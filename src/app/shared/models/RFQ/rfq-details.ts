export interface RfqMaterialResponse {
  projectId?: number;
  projectName?: string;
  projectMaterialList?: RfqMat[];
  projectAddressList?: Address[];
}
export interface RfqMat {
  projectId?: number;
  materialId?: number;
  materialName?: string;
  requestedQty?: number;
  estimatedQty?: number;
  dueDate?: Date;
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
