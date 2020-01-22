export interface PODetailLists {
  draftedPOList: PurchaseOrder[];
  awardedPOList: PurchaseOrder[];
  acceptedPOList: PurchaseOrder[];
  rejectedPOList: PurchaseOrder[];
}
export interface PurchaseOrder {
  purchaseOrderId: number;
  poNumber: number;
  projectId: number;
  projectAddressId: number;
  rfqId: number;
  supplierId: number;
  supplierAddressId: number;
  comments: string;
  poStatus: number;
  approvedBy: string;
  approvedOn: string;
  totalMaterials: number;
  poAmount: number;
  poName: string;
}
