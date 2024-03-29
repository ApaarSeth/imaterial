export interface PresetItem {
    presetLabel: string;
    range: DateRange;
}

export interface DateRange {
    fromDate: Date;
    toDate: Date;
}

export interface CalendarOverlayConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
    shouldCloseOnBackdropClick?: boolean;
}

export interface NgxDrpOptions {
    presets: Array<PresetItem>;
    format: string;
    range: Range;
    excludeWeekends?: boolean;
    locale?: string;
    fromMinMax?: Range;
    toMinMax?: Range;
    applyLabel?: string;
    cancelLabel?: string;
    animation?: boolean;
    calendarOverlayConfig?: CalendarOverlayConfig;
    placeholder?: string;
    startDatePrefix?: string;
    endDatePrefix?: string;
}