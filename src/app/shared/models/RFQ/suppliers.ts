export interface Suppliers {
  id: number;
  status: number;
  createdBy: string;
  createdAt: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  supplierId: number;
  supplier_name: string;
  contact_no: number;
  email: string;
  pan: string;
  checked?: boolean;
  supplier_rating?: number;
  show?: boolean;
}
