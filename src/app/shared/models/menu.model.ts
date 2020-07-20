export interface MenuList {
    featureList?: featureList[];
    moduleList?: moduleList[];
}

export interface featureList {
    featureId?: number;
    featureName?: string;
    moduleId?: number;
    planFeatureId?: any;
    planId?: any;
    subModuleId?: any;
}

export interface moduleList {
    moduleIcon?: string;
    moduleId?: number;
    moduleName?: string;
    modulePath?: string;
    moduleDisplayName?: string;
    subModuleList?: subModuleList;
}

export interface subModuleList {
    subModuleIcon?: string;
    subModuleId?: number;
    subModuleName?: string;
    subModulePath?: string;
}
