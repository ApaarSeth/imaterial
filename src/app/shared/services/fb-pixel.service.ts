import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Utils } from '../helpers/utils';
@Injectable({ providedIn: "root" })

export class FacebookPixelService {
    constructor() { }
    load() {
        if (Utils.isLive()) {

            (function (f: any, b, e, v, n, t, s) {
                if (f.fbq) return; n = f.fbq = function () {
                    n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                }; if (!f._fbq) f._fbq = n;
                n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0;
                t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
            // (window as any).fbq.disablePushState = true; //not recommended, but can be done
            (window as any).fbq('init', '212514979956545');
            // (window as any).fbq('track', 'PageView');
        }


    }

    fire(eventName) {
        if (Utils.isLive()) {
            const win = window as any;
            if (win.fbq) {
                (window as any).fbq('track', eventName);
            }
        }
    }
}
