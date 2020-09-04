export interface BomTabsConfig {
    name: string;
    preSelectData?: any;
    data?: any;
    table?: any;
}

export type BomFilterType = 'MULTI_SELECT_SEARCH' | 'INPUT_TEXT_SEARCH';

export interface BomFilterConfig {
    type?: string;
    title?: string;
    options?: BomFilterOptions[];
}

export interface BomFilterOptions {
    name: string;
    data?: any;
    type: BomFilterType;
    key: any;
    id?: number;
    dependSearch?: number;
    preSelected?: any;
}

export interface BomSearchData {
    id: number;
    name: string;
    [ x: string ]: any;
    type?: string;
    preSelected?: any;
}

export interface BomFilterItemConfig {
    title: string;
    placeholder: string;
    list: BomSearchData[];
    preSelected?: any;
}

export interface BomFilterData {
    tradeList?: any;
    categoryList?: any;
    materialName?: string;
}

export interface BomCommonTableConfig {
    groupName?: BomTableProptery;
    materialList?: BomTableMaterials;
}

export interface BomTableProptery {
    visible?: boolean;
    formProperty?: boolean;
    headName?: string;
}

export interface BomTableMaterials {
    materialName?: BomTableProptery;
    tradeList?: BomTableProptery;
    materialUnit?: BomTableProptery;
    estimatedQty?: BomTableProptery;
    estimatedRate?: BomTableProptery;
    id?: BomTableProptery;
    materialCode?: BomTableProptery;
    materialGroup?: BomTableProptery;
    pid?: BomTableProptery;
    sortSeq?: BomTableProptery;
    tradeName?: BomTableProptery;
    treadId?: BomTableProptery;
}