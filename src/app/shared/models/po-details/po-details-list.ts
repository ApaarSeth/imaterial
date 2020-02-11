export interface PODetailLists {
  draftedPOList: PurchaseOrder[];
  sendForApprovalPOList: PurchaseOrder[];
  acceptedRejectedPOList: PurchaseOrder[];
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
