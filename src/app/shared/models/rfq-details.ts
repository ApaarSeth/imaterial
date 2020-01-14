export interface RfqMaterialResponse {
  projectId?: number;
  projectName?: string;
  defaultAddress?: Address;
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
  checked?: boolean;
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
