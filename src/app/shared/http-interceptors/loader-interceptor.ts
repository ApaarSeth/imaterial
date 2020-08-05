import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GlobalLoaderService } from '../services/global-loader.service';
import { ConfigurationConstants } from '../constants/configuration-constants';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = []
    constructor(private globalLoader: GlobalLoaderService) {
    }

    removeRequest(req: HttpRequest<any>) {
        const i = this.requests.indexOf(req);
        if (i >= 0) {
            this.requests.splice(i, 1);
        }
        this.globalLoader.isLoading.next(this.requests.length > 0);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.has(ConfigurationConstants.HEADER_SKIP_LOADER)) {
            const headers = req.headers.delete(ConfigurationConstants.HEADER_SKIP_LOADER);
            const directRequest = req.clone({ headers });
            return next.handle(directRequest);
        }
        // else {
        // let ended = false;
        // if (req.url.includes("topmaterial") || req.url.includes("material")) {
        //     this.globalLoader.show();
        // }
        else {
            this.requests.push(req);
            this.globalLoader.isLoading.next(true);
            return Observable.create(observer => {
                const subscription = next.handle(req)
                    .subscribe(
                        event => {
                            if (event instanceof HttpResponse) {
                                this.removeRequest(req);
                                observer.next(event);
                            }
                        },
                        err => {
                            alert('error' + err);
                            this.removeRequest(req);
                            observer.error(err);
                        },
                        () => {
                            this.removeRequest(req);
                            observer.complete();
                        });
                // remove request from queue when cancelled
                return () => {
                    this.removeRequest(req);
                    subscription.unsubscribe();
                };
            });
            //     const timer = setTimeout(() => {    //<<<---    using ()=> syntax
            //         if (!ended) {
            //             this.globalLoader.show();
            //         }
            //         clearTimeout(timer);
            //     }, ConfigurationConstants.LOADING_TIMEOUT);
            // }
            // return next.handle(req).pipe(tap(event => {
            //     // Succeeds when there is a response; ignore other events
            //     if (event instanceof HttpResponse) {
            //         ended = true;
            //         this.globalLoader.hide();
            //     }
            // }, err => {
            //     // Operation failed; error is an HttpErrorResponse
            //     ended = true;
            //     this.globalLoader.hide();
            // }));
        }

    }
}
