import { ProjectDetails } from './project-details';
import { SupplierRoutingModule } from 'src/app/features/supplier/supplier-routing.module';
import { FeaturesList } from './PO/po-data';

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

export interface SupplierObj{
  moduleFeatures: SupplierModule;
  supplierList: SupplierAdd[];
}

export interface SupplierModule{
  featureList: SuppFeaturesList[];
  planId: number;
}

export interface SuppFeaturesList{
  featureName: string;
  isAvailable: number;
}

export interface SupplierAdd {
  contactNo?: string;
  countryCallingCode?: string;
  createdAt?: string;
  createdBy?: string;
  email?: string,
  gstNo?: string;
  id?: number,
  lastUpdatedAt?: string;
  lastUpdatedBy?: string;
  pan?: string;
  phoneNo?: string;
  status?: number,
  supplierId?: number,
  supplierName?: string,
  supplierOrganizationId?: number;
  supplierRating?: number;
  userId?: number;
}