import { Injectable } from "@angular/core";
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Router } from '@angular/router';
import { Utils } from '../helpers/utils';
import { GaEventsData, GaPageViewData } from '../models/common.models';


@Injectable({ providedIn: "root" })
export class AppNavigationService {
    constructor(
        protected ga: GoogleAnalyticsService,
        private router: Router) {
    }
    /**
    * @description This will push GTM 
    * @param eventName: string
    * @param eventLabel: string
    * */
    gaEvent(gaEvent: GaEventsData) {
        if (Utils.isLive()) {
            this.ga.event(gaEvent.action, gaEvent.category, gaEvent.label, gaEvent.value)
        } else {
            // do nothing
        }
    }
    /**
 * @description This will push GTM 
 * @param path: string
 * @param title: string
 * */
    gaPageView(data: GaPageViewData) {
        if (Utils.isLive()) {
            this.ga.pageView(data.path, data.title, data.location, data.options)
        }
    }

    /**
     * @description This will navigate to path and push GTM code if any
     * @param path: string
     * @param event?: string
     * @param evLabel?: string
     * */

    navigateTo(path, eventData?: GaEventsData) {
        if (eventData) {
            this.gaEvent(eventData);
        }
        this.router.navigate([path]);
    }

}