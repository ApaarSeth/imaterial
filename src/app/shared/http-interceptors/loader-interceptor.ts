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

    constructor(private globalLoader: GlobalLoaderService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.has(ConfigurationConstants.HEADER_SKIP_LOADER)) {
            const headers = req.headers.delete(ConfigurationConstants.HEADER_SKIP_LOADER);
            const directRequest = req.clone({ headers });
            return next.handle(directRequest);
        }
        this.globalLoader.show();
        return next.handle(req).pipe(tap(event => {
            // Succeeds when there is a response; ignore other events
            if (event instanceof HttpResponse) {
                this.globalLoader.hide();
            }
        }, err => {
            // Operation failed; error is an HttpErrorResponse
            this.globalLoader.hide();
        }));
    }
}
