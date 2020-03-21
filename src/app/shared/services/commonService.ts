import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})


export class CommonService {

    formatDate(oldDate): string {
        let newDate = new Date(oldDate);
        newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
        return String(newDate);
    }
}

