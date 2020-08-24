export type AvdOptionUpdateType = 'PROJECT' | 'SUPPLIER' | 'MATERIAL' | 'RAISEDBY' | 'RAISEDDATE' | 'EXPIRYDATE';
export type AvdOptionType = 'MULTI_SELECT' | 'DATE' | 'MULTI_SELECT_SEARCH' | 'INPUT_NUMBER';
export type AvdSearchType = 'PO' | 'RFQ' | 'INDENT';

export interface AdvSearchConfig {
    title: string;
    type: AvdSearchType;
    options: AdvSearchOption[];
}
export interface AdvSearchOption {
    name: string;
    data?: AdvSearchData[];
    type: AvdOptionType;
    key: any;
}

export interface AdvSearchData {
    id: number;
    name: string;
    [ x: string ]: any;
    type?: string;
}

export interface AdvSearchItemConfig {
    title: string;
    placeholder: string;
    list: AdvSearchData[];
}

export interface AdvanceRFPStatus {
    id: number;
    name: string;
}

export interface rfqRequestData {
    projectIDList?: any;
    supplierIDList?: any;
    materialCodeList?: any;
    rfqStatus?: any;
    userIDList?: any;
    rfqRaisedStartDate?: string;
    rfqRaisedEndDate?: string;
    rfqExpiryStartDate?: string;
    rfqExpiryEndDate?: string;
}

export interface poRequestData {
    projectIdList?: any;
    supplierIdList?: any;
    materialCodeList?: any;
    poRaisedStartDate?: string;
    poRaisedEndDate?: string;
    poStatus?: any;
    poCreatedByList?: any;
    poApprovedByList?: any;
    poAmountMin?: number;
    poAmountMax?: number;
}

export interface indentRequestData {
    projectId?: number;
    materialCodeList?: any;
    indentRaisedByList?: any;
    indentStatus?: any;
    indentRaisedStartDate?: string;
    indentRaisedEndDate?: string;
    indentRequestStartDate?: string;
    indentRequestEndDate?: string;
}
