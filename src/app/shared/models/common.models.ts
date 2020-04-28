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


