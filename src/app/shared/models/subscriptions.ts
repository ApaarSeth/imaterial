export interface SubscriptionsList {
    planFrequencyList?: planFrequencyList;
}

export interface planFrequencyList {
    frequencyHeader: string;
    PlanMap?: any;
    planList?: planList;
}

export interface planList {
    planId?: number;
    planName?: string;
    planDescription?: any;
    countryId?: any;
    sortSeq?: any;
    offerName?: string;
    offerCode?: string;
    currencyCode?: string;
    offerStartDate?: string;
    planPrice?: string;
    isTaxable?: any;
    taxValue?: number;

    planLimit?: planLimit;
    planFeatureList?: any;
    planFeatureObjList?: planFeatureObjList;
}

export interface planLimit {
    planLimitId?: any;
    planId?: any;
    userCount?: number;
    projectCount?: number;
}

export interface planFeatureObjList {
    featureName?: string;
    available?: boolean;
}
