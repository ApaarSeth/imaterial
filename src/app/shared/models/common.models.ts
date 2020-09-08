import { material } from './category';
export interface GaEventsData {
    action: string;
    category?: string;
    label?: string;
    value?: number;
    interaction?: boolean;
}

export interface GaPageViewData {
    path?: string;
    title?: string;
    location?: string;
    options?: Object;
}

export interface GaTagData {
    action: string;
    command?: string;
    options?: any;
}

export interface TaxInfo {
    createdAt: string
    createdBy: string
    id: number
    lastUpdatedAt: string
    lastUpdatedBy: string
    organizationId: number
    status: number
    taxDescription: null
    taxId: number
    taxName: string
    taxValue: number
}

export interface OtherCostInfo {
    createdAt: string
    createdBy: string
    id: number
    lastUpdatedAt: string
    lastUpdatedBy: string
    organizationId: number
    otherCostAmount: number
    otherCostDescription: string
    otherCostId: number
    otherCostName: string
    rfqSupplierId: number
    status: number
}

export interface OverallOtherCost {
    createdAt: string
    createdBy: string
    id: number
    lastUpdatedAt: string
    lastUpdatedBy: string
    organizationId: number
    otherCostAmount: number
    otherCostDescription: string
    otherCostId: number
    otherCostName: string
    rfqSupplierId: number
    status: number
}

export interface PaginatorConfig {
    limit?: number;
    pageNumber?: number;
    totalCount?: number;
}