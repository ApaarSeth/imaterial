export interface orgTrades {
    id: number
    status: number
    createdBy: string
    createdAt: string
    lastUpdatedBy: string
    lastUpdatedAt: string
    tradeId: number
    tradeName: string
    tradeDescription: string
    isAttatched: boolean
    organizationId: number
}

export interface tradeRelatedCategory {
    categoriesName: string,
    categoriesCode: string
}