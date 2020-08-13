import { Suppliers } from "./suppliers";
import { ImageDocsLists } from '../PO/po-data';

export interface RfqMaterialResponse {
  projectId?: number;
  projectName?: string;
  defaultAddress?: Address;
  projectMaterialList?: RfqMat[];
  projectAddressList?: Address[];
  prevMatListLength?: number;
}
export interface RfqMat {
  projectId?: number;
  materialId?: number;
  materialName?: string;
  requestedQty?: number;
  estimatedQty?: number;
  dueDate?: Date;
  checked?: boolean;
  quantity?: number;
  estimatedRate?: number;
  fullfilmentDate?: Date | string;
  // to do change name makes to brands
  makes?: string[];
  materialUnit?: string;
  poAvailableQty?: number;
  documentList?: ImageDocsLists[];
  documentsList?: ImageDocsLists[];
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
  projectAddressId: number;
  projectdefaultAddressId: number;
  primaryAddress: number;
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

export interface AddRFQ {
  id: number;
  status: number;
  createdBy: string;
  createdAt: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  rfqId: number;
  rfq_status: string;
  rfqName: string;
  dueDate: string;
  supplierId: number[];
  supplierDetails: Suppliers[];
  rfqProjectsList: RfqMaterialResponse[];
  documentsList: DocumentDetails[];
  selectBuildsupplyAsSupplier?: boolean
  terms: Terms;
  rfqCurrency?: rfqCurrency;
}

export interface rfqCurrency {
  exchangeCurrencyId: number;
  exchangeCurrencyName: string;
  exchangeCurrencyFlag: string;
  exchangeCountryId: string;
  exchangeCurrency: string;
  exchangeCurrencySymbol: string;
  exchangeValue: number;
  primaryCurrencyId: number;
  primaryCurrencyName: string;
  primaryContryId: string;
  primaryCurrency: string;
  primaryCurrencySymbol: string;
  primaryCurrencyFlag: string;
}
export interface DocumentDetails {
  documentType: string;
  documentDesc: string;
  documentUrl: string;
}

export interface Terms {
  termsId?: number;
  termsDesc: string;
  termsType: string;
  otherDesc?: string;
}

export interface CountryCurrency {
  countryId?: number,
  currency?: string,
  currencyCode?: string,
  currencyId?: number,
  imageUrl?: string,
  symbol?: string
}