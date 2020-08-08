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
  poStatusChangedOn: string;
  poStatusChangedBy: string
  supplierName: string;
  currencyCode: string;
}

export interface PurchaseOrderData {
  orgId: number;
  dataSource: string;
  startDate: string;
  endDate: string;
  totalCount: number;
  totalValue: number;
  graphData: Array<any>;
}
