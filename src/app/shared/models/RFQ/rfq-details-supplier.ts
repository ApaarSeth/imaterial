import { DocumentList, ImageDocsLists } from '../PO/po-data';

export interface SendRfqObj {
  dueDate: Date;
  comments?: string;
  quoteValidTill: Date;
  projectList: ProjectRfqObj[];
  terms?: any;
  DocumentsList?: DocumentList[];
  isInternational?: number;
  rfqCurrency: any;
  baseCurrencyCode?: string;
}
export interface ProjectRfqObj {
  projectId: number;
  projectName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode?: string,
  gst: string;
  materialList: MaterialRfqObj[];
}

export interface MaterialRfqObj {
  materialName: string;
  materialId: number;
  rfqBrandList: BrandRfqObj[];
  //rfqDetailId: number;
  materialQuantity: number;
  materialUnit: string;
  materialIgst: number;
  materialSgst: number;
  Igst?: number;
  validGst?: boolean;
  materialCgst: number;
  materialIGSTFlag: boolean;
  materialGst?: number;
  fullfilmentDate?: string;
  documentsList?: ImageDocsLists[];
}

export interface BrandRfqObj {
  brandName: string;
  brandId: string;
  brandRate: number;
  brandAmount: number;
  brandRateFlag: boolean;
  validBrand?: boolean;
  rfqDetailId: number;
  tempRate?: number;
}

export interface TaxAndOtherCost {
  organizationId: number;
  rfqId: number;
  otherCostInfo: any;
  taxInfo: any;
}