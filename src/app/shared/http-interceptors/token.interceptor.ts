import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient, HttpBackend, HttpParams } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { TokenService } from '../services/token.service';
import { environment } from '../../../environments/environment';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private reqInProgress = false;

    constructor(private tokenService: TokenService,
        private http: HttpClient,
        private handler: HttpBackend) {
        this.http = new HttpClient(this.handler);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.getAuthHeaders().pipe(
            mergeMap(headers => {
                const authorizationKey = `Bearer ${this.tokenService.getToken()}`;
                //  const authorizationKey = `Bearer ${this.tokenService.getToken()}`;

                // if (!request.headers.has('Content-Type')) {
                //     // request = request.clone({
                //     //   headers: request.headers.set('Content-Type', 'application/json')
                //     // });
                // }

                if (request.url.indexOf('api/auth/signup') > -1 ||
                    request.url.indexOf('oauth/token') > -1 ||
                    request.url.indexOf('material/materialsSpecs') > -1 ||
                    request.url.indexOf('api/auth/otp/create') > -1 ||
                    request.url.indexOf('api/auth/otp/verify') > -1 ||
                    request.url.indexOf('verify/email') > -1 ||
                    request.url.indexOf('material/groups') > -1 ||
                    request.url.indexOf('user/info/') > -1 ||
                    request.url.indexOf('material/get/trades') > -1 ||
                    request.url.indexOf('rfq/details/supplier/') > -1 ||
                    request.url.indexOf('api/user/resetPassword') > -1 ||
                    request.url.indexOf('trade/get/all/categories') > -1 ||
                    request.url.indexOf('supplier/documents/upload') > -1) {
                    return next.handle(request)
                }

                else if (headers) {
                    let modifiedRequest = request.clone({
                        headers: request.headers.set(
                            'Authorization', authorizationKey)
                            .set('userId', this.tokenService.getUserId().toString())
                            .set('orgId', this.tokenService.getOrgId().toString())
                    });

                    // let modifiedRequest = request.clone({
                    //     setHeaders: headers
                    // });
                    return next.handle(modifiedRequest);
                }
            }));
    }


    getAuthHeaders(): Observable<any> {
        const t = this.tokenService.getAuthHeader();
        return of(t);

    }
}
