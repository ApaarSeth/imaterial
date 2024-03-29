import { Address, rfqCurrency } from './rfq-details';
import { Currency } from '../currency';

export interface Rfq {
    rfqName: string,
    dueDate: string,
    rfqStatus: string,
    supplierId: number[],
    supplierDetails: Supplier[],
    rfqProjectsList: RfqProjects[],
    documentsList: Documents[],
    terms: TermsObj
    rfqCurrency: rfqCurrency;
}

export interface RfqProjects {
    defaultAddress: Address,
    projectId: number,
    projectName: string,
    projectMaterialList: RfqMaterials[],
    rfqMaterials: RfqMaterials[],
}

export interface RfqMaterials {
    materialId: number,
    materialCode: string,
    materialName: string,
    materialGroup: string,
    materialUnit: string,
    materialSubGroup: string,
    materialSpecs: string,
    rfqMaterialQty: number,
    materialBrandId: number,
    materialBrandName: string,
    quantity: number,
    projectId: number,
    projectAddressID: number,
    makes: string[],
}

export interface Supplier {
    supplierId: number,
    supplierName: string,
    contactNo: string,
    phoneNo?: string,
    email: string,
    pan: string,
    countryCallingCode: string,
    supplierRating: number;
}

export interface TermsObj {
    termsDesc: string,
    termsType: string,
    otherDesc: string;
}

export interface Documents {
    documentType: string;
    DocumentDesc: string;
    DocumentUrl: string;
    documentId?: number;
    documentName?: string;
}