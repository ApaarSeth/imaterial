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
    // purchaseOrderDetailList: PurchaseOrderDetail[],
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
    // createdAt:
    issuedQty: number,
    deliveredQty: number,
    issuedDate: string
}





// IssuedQuantityList []IssuedQuantityDetail
// CreatedBy string `json:"createdBy" db:"created_by"`
// CreatedAt time.Time `json:"createdAt" db:"created_at"`