export interface SupplierLiabilityReport {
    totalTaxAmount: number
    totalPoAmount: number
    otherCost: number
    gstAmount: number
    grnAmount: number
    poAmount: number
    paymentRecived: number
    supplierReportDataList: SupplierReportData[]
    currencyCode: string
}

export interface SupplierReportData {
    supplierId: number
    supplierName: string
    totalTaxAmount: number
    totalPoAmount: number
    otherCost: number
    gstAmount: number
    grnAmount: number
    poAmount: number
    paymentRecived: number
    projectReportDataList: ProjectReportData[]
    currencyCode: string
}

export interface ProjectReportData {
    projectId: number
    projectName: string
    totalTaxAmount: number
    totalPoAmount: number
    otherCost: number
    gstAmount: number
    grnAmount: number
    poAmount: number
    paymentRecived: number
    entityDataList: PurchaseOrderData[]
    currencyCode: string
}

export interface PurchaseOrderData {
    entityId: number
    entityLabel: string
    entityType: string
    totalTaxAmount: number
    totalPoAmount: number
    otherCost: number
    gstAmount: number
    grnAmount: number
    poAmount: number
    paymentRecived: number
    currencyCode: string
}

