export interface SubscriptionsPayments {
    billingAddress?: string;
    billingCity?: string;
    billingCountry?: string;
    billingEmail?: string;
    billingName?: string;
    billingState?: string;
    billingTel?: string;
    billingZip?: string;
    cancelUrl?: string;
    customerEmail?: string;
    customerName?: string;
    customer_identifier?: string;
    failureUrl?: string;
    orderId?: string;
    promoCode?: string;
    redirectUrl?: string;
    serviceName?: string;
    subscriptionPlanRefId?: string;
    validUpto?: string;
    subscriptionPlanPricRefId?: string;
}

export interface SubscriptionInternalPost {
    planId?: number;
    planPricingId?: string;
    offerId?: string;
    isTrial?: number;
}

export interface SubcriptionsInternalResponse {
    planId?: string;
    planPricingId?: string;
    subscriptionId?: string;
    startDate?: string;
    endDate?: string;
    transactionId?: string;
}