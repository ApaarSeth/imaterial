import { ProjectDetails } from './project-details';

export interface AllSupplierDetails {
  id?: number,
  status?: 0,
  createdBy?: string,
  createdAt?: string,
  lastUpdatedBy?: string,
  lastUpdatedAt?: string,
  supplierId?: number,
  supplierName?: string,
  contactNo?: number,
  email?: string,
  pan?: string,
  supplierRating?: number,
}

export interface SupplierDetailsPopUpData {
  isDelete?: boolean;
  isEdit: boolean;
  detail?: SupplierAdd;
  countryList?: any;
}

export interface SupplierIds {
  userIds?: Array<Number>;
}

export interface SupplierAdd {
  id?: number,
  status?: number,
  supplierId?: number,
  supplierName?: string,
  contactNo?: number,
  email?: string,
  pan?: string
}