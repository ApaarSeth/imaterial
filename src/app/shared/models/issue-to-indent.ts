import { PODetailLists } from './po-details/po-details-list';

export interface IssueToIndentDetails {
    materialId: number,
    materialCode: string,
    projectId: number,
    materialName: string,
    materialGroup: string,
    materialUnit: string,
    estimatedQty: number,
    estimatedRate: number,
    materialCustomFlag: number,
    materialCustomId: number,
    materialSubGroup: string,
    materialSpecs: string,
    requestedQuantity: number,
    checked: boolean,
    issueToProject: number,
    availableStock: number,
    indentDetailList: IndentVO[],
    purchaseOrderDetailList: PODetailLists[],
    dueDate: string,
    quantity: number,
    issuedQty: number
}

export interface IndentVO {
    indentId: number,
    materialId: number,
    projectId: number,
    requestStatus: number,
    dueDate: string,
    quantity: number,
    unit: string,
    comments: string,
    materialCount: number,
    indentName: string,
    createdBy: string,
    IssuedQuantityList: IssuedQuantityDetail[],
    createdAt: string,
    issuedQty: number,
    deliveredQty: number,
    issuedDate: string
}

export interface IssuedQuantityDetail {
    issuedQty: number,
    issuedDate: string
}

// export interface sendIssuedQuantityObj {
//     indentId: number,
//     issuedQty: number,
//     issuedDate: string
// }