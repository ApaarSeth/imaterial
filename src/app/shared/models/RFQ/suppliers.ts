export interface Suppliers {
  id: number;
  status: number;
  createdBy: string;
  createdAt: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  supplierId: number;
  supplierName: string;
  contactNo: number;
  email: string;
  pan: string;
  checked?: boolean;
  supplierRating?: number;
}
