import { Documents } from './RFQ/rfq-view';

export interface GRNList {
  GrnList: GRNDetails[];
  DocumentsList: Documents[];
}
export interface GRNDetails {

  purchaseOrderDetailId: number,
  purchaseOrderId: number,
  projectId: number,
  grnId: number,
  grnDetailId: number,

  materialName: string,
  materialGroup: string,
  materialSubGroup: string,
  materialSpecs: string,
  materialCode: string,

  materialId: number,
  materialBrand: string,
  materialQuantity: number,
  materialUnit: string,
  materialUnitPrice: number,
  deliveredDate: Date,
  deliverableQty: number,
  deliveredQty: number,
  certifiedQty: number,
  awardedQty?: number,
  organizationId?: number

}

export interface GRN {
  grnDetailId: number,
  grnId: number,
  materialId: number,
  materialBrand: string,
  deliveredQty: number,
  deliveredDate: Date
}


export interface GRNPopupData {
  isDelete?: boolean;
  isEdit: boolean;
  pID?: number;
  detail?: GRNDetails;
}

export interface AllProjectsGRNData {
  projectName: string;
  baseCurrency?: any
  grnDataList: GRNDataList[];
}

export interface GRNDataList {
  grnName: string;
  GrnId: number;
  poNumber: string;
  grnDate: string;
  addedBy: string;
  projectName: string;
  grnDetailList: GRNDetailList[];
  grnDocuments: GRNDocuments[];
}

export interface GRNDetailList {
  GrnId: number;
  GrnNumber: string;
  MaterialBrand?: string;
  GrnDate: string;
  MaterialId: number
  PurchaseOrderId: number;
  PurchaseOrderNumber: string;
  ProjectId: number;
  ProjectName: "IndiaProject"
  SupplierName: string;
  Comments: string;
  MaterialName: string;
  MaterialUnit: string;
  MaterialUnitPrice: number;
  DeliveredQty: number;
  TotalAmount: number;
  Amount: number;
  EstimatedQty: number;
  AddedBy: string;
}

export interface GRNDocuments {
  documentId: number;
  documentType: string;
  documentDesc: string;
  documentUrl: string;
  documentName: string;
}