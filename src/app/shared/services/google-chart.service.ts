import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare var google: any;

@Injectable({
    providedIn: "root"
})
export class GoogleChartService {
    private google: any;

    barChartData = new BehaviorSubject(null)
    pieChartData = new BehaviorSubject(null)
    constructor() {
        this.google = google;
    }

    getGoogle() {
        return this.google;
    }


}