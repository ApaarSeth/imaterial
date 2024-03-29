import { formatDate } from '@angular/common';
import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

export const PICK_FORMATS = {
    parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' }
    }
};

@Injectable({
    providedIn: 'root'
})
export class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat: Object): string {
        if (displayFormat === 'input') {
            return formatDate(date, 'dd-MMM-yyy', this.locale);
        } else {
            return date.toDateString();
        }
    }
}
