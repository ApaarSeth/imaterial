export interface GRNDetails {

    purchaseOrderDetailId: number,
    purchaseOrderId: number,
    projectId: number,
    grnId: number,
    grnDetailId: number,

    materialName: string,
    materialGroup: string,
    materialSubGroup: string,
    materialSpecs: string,
    materialCode: string,

    materialId: number,
    materialBrand: string,
    materialQuantity: number,
    materialUnit: string,
    materialUnitPrice: number,
    deliveredDate: Date,
    deliverableQty: number,
    deliveredQty: number,
    certifiedQty: number,
    awardedQty?:number,
    organizationId?: number

}

export interface GRN {
    grnDetailId: number,
    grnId: number,
    materialId: number,
    materialBrand: string,
    deliveredQty: number,
    deliveredDate: Date
}