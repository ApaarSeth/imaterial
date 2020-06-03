export class TaxInfo {
    id: number;
    status: number;
    createdBy: string;
    createdAt: string;
    lastUpdatedBy: string;
    lastUpdatedAt: string;
    taxId: any;
    taxName: string;
    taxDescription: any;
    taxValue: number;
    organizationId: number;
}

export class OtherCostInfo {
    id: number;
    status: number;
    createdBy: string;
    createdAt: string;
    lastUpdatedBy: string;
    lastUpdatedAt: string;
    otherCostId: any;
    otherCostName: string;
    otherCostDescription: any;
    otherCostAmount: number;
    organizationId: number;
}