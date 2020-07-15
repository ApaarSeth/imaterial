import { RfqMaterialResponse, rfqCurrency } from '../RFQ/rfq-details';
import { Suppliers } from '../RFQ/suppliers';
import { OtherCostInfo } from '../tax-cost.model';
import { TaxInfo } from '../common.models';

export interface POData {
  supplierAddress: SupplierAddress;
  projectAddress: ProjectAddress;
  billingAddress: BillingAddress;
  materialData: PoMaterial[];
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  poNumber: number;
  poName: string;
  poValidUpto: string;
  DocumentsList: DocumentList[];
  Terms: terms;
  purchaseOrderCurrency: PurchaseOrderCurrency;
  comments: string;
  projectId: number;
  approverId?: number;
  DocumentData?: FormData[];
  poStatusChangedBy?: string;
  poStatusChangedOn?: string;
  approverName?: string;
  roleDescription?: string;
  isInternational: number;
  additionalOtherCostInfo?: OtherCostInfo[];
  additionalOtherCostAmount?: number;
  currencyCode?: string;
  sellerPORating?: number;
  poCreatedBy?: number;
  poStatus?: string;
}

export interface PurchaseOrderCurrency {
  UserId: string
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
  purchaseOrderId: 0
}
export interface PoMaterial {
  materialId: number;
  materialCode: string;
  projectId: number;
  materialName: string;
  materialGroup: string;
  materialUnit: string;
  estimatedQty: number;
  estimatedRate: number;
  materialCustomFlag: number;
  materialCustomId: number;
  materialSubGroup: string;
  materialSpecs: string;
  requestedQuantity: number;
  checked: boolean;
  issueToProject: number;
  availableStock: number;
  indentDetailList: null;
  fullfilmentDate: string;
  poAvailableQty?: number;
  validQuantity?: boolean;
  purchaseOrderDetailList: PurchaseOrder[];
  taxInfo: TaxInfo[];
  otherCostInfo: OtherCostInfo[]
  totalTax: number;
  taxAmount: number;
  totalOtherTax: number;
  otherCostAmount: number;
}

export interface PurchaseOrder {
  id: number;
  status: number;
  created_by: string;
  createdAt: string;
  last_updated_by: string;
  last_updated_at: string;
  projectName: string;
  addressId: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  purchaseOrderDetailId: number;
  purchaseOrderId: number;
  materialId: number;
  materialBrand: string;
  materialQuantity: number;
  materialUnit: string;
  materialUnitPrice: number;
  materialIgst: number;
  materialSgst: number;
  materialCgst: number;
  amount: number;
  gstAmount: number;
  total: number;
  qty?: number;
  validUpto?: string;
  taxAmount?: number;
  otherCostAmount?: number
}
export interface terms {
  termsId?: number;
  termsDesc: string;
  termsType: string;
}

export interface SupplierAddress {
  supplierAddressId: number;
  supplierId: number;
  supplierName: string;
  contactNo: string;
  email: string;
  addressId: number;
  primaryAddress: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  gstNo: string;
}

export interface SupplierSelectedAddress {

  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  gstNo: string;
}
export interface ProjectAddress {
  projectAddressId: number;
  supplierId: number;
  projectName: string;
  addressId: number;
  primaryAddress: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  email: string;
  contactNo: string;
  firstName: string;
  lastName: string;
  projectUserId: number;
  gstNo: string;
}

export interface BillingAddress {
  projectAddressId: number;
  supplierId: number;
  projectName: string;
  companyName: string;
  addressId: number;
  primaryAddress: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  email: string;
  contactNo: string;
  firstName: string;
  lastName: string;
  projectBillingUserId: number;
  projectBillingAddressId: number;
  gstNo: number;
}

export interface CardData {
  supplierAddress: SupplierAddress;
  projectAddress: ProjectAddress;
  billingAddress: BillingAddress;
  poNumber: number;
  poValidUpto: string;
  projectId: number;
  isInternational?: number;
  sellerPORating?: number;
  poCreatedBy?: number;
  poStatus?: string;
}

export interface DocumentList {
  documentType: string;
  DocumentDesc: string;
  DocumentUrl: string;
  documentName?: string;
  Url?: string;
}

export interface ApproverData {
  id: number;
  status: number;
  created_by: string;
  created_at: string;
  last_updated_by: string;
  last_updated_at: string;
  userId: number;
  userType: string;
  organizationId: number;
  accountOwner: number;
  email: string;
  contactNo: number;
  countryCode: string;
  uniqueCode: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  accountStatus: number;
}

export interface initiatePo {
  projectId: number;
  projectName: string;
  projectAddressId: number;
  addressId: number;
  supplierId: number;
  supplierAddressId: number;
  supplierName: string;
  rfqId: null;
  rfqCurrency: rfqCurrency;
  materialList: poMaterialList[];
}

export interface poMaterialList {
  materialId: number;
  materialQty: number;
  brandNames: string[];
  materialUnitPrice: number;
}

export interface poApproveReject {
  poApproverId: number;
  purchaseOrderId: number;
  userId: number;
  isApproved: number;
}

export interface initiatePoData {
  selectedMaterial: RfqMaterialResponse[],
  selectedSupplier: Suppliers
  poCurrency: rfqCurrency
}
export interface DownloadData {
  fileName?: string;
  url?: string;
}

export interface PaymentHistory {
  exchangeRate: string, exchangeValue: number, id: number, status: number, createdBy: string, createdAt: string, lastUpdatedBy: string, lastUpdatedAt: string, supplierPaymentId: number, purchaseOrderId: number, supplierId: number, amountPaid: number, transactionId: string, paymentDate: string
}

export interface SavePaymnetRecord {
  amountPaid: number,
  paymentDate: string,
  TransactionId: string
}

export interface PoPayementDetail {
  purchaseOrderCurrency: rfqCurrency,
  purchaseOrderId: number,
  currencyCode: string,
  poAmount: number,
  grnAmount: number,
  gstAmount: number,
  paymentRecived: number
  totalTaxAmount: 0,
  totalPoAmount: 3300000,
  otherCost: 0,
}

export interface ImageList {
  documentUrl?: string;
  documentShortUrl: string;
  documentType?: string;
  documentDesc: string;
  documentId: number;
  documentThumbnailUrl?: string;
  documentThumbnailShortUrl?: string;
  supplierId?: number;
  materialId?: number;
}

export interface ImageDocsLists{
  projectId: number;
  materialId: number;
  materialDocumentId: number;
  documentId: number;
  documentUrl: string;
  documentDesc: string;
  documentType: string;
  documentShortUrl: string;
  ThumbnailFileName?: string;
  ThumbnailUrl?: string;
  documentThumbnailUrl?: string;
  documentThumbnailShortUrl?: string;
  supplierId?: number;
}