import { Address } from './rfq-details';

export interface Rfq {
    rfqName: string,
    dueDate: string,
    rfq_status: string,
    supplierId: number[],
    supplierDetails: Supplier[],
    rfqProjectsList: RfqProjects[],
    documentsList: Documents[],
    terms: TermsObj
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
    supplier_name: string,
    contact_no: string,
    email: string,
    pan: string,
}

export interface TermsObj {
    termsDesc: string,
    termsType: string,
}

export interface Documents {
    documentType: string,
    DocumentDesc: string,
    DocumentUrl: string
}
