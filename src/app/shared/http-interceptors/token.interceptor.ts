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
                //  const authorizationKey = `Bearer ${this.tokenService.getToken()}`;

                // if (!request.headers.has('Content-Type')) {
                //     // request = request.clone({
                //     //   headers: request.headers.set('Content-Type', 'application/json')
                //     // });
                // }

                if (request.url.indexOf('api/auth/signup') > -1 ||
                    request.url.indexOf('oauth/token') > -1 ||
                    request.url.indexOf('material/materialsSpecs') > -1 ||
                    request.url.indexOf('material/groups') > -1) {
                    return next.handle(request)
                }
                else if (headers) {
                    // request = request.clone({
                    //     headers: request.headers.set('Authorization', this.tokenService.getRole()),

                    // });
                    let modifiedRequest = request.clone({
                        setHeaders: headers
                    });
                    return next.handle(modifiedRequest);
                }
            }));
    }


    getAuthHeaders(): Observable<any> {
        const t = this.tokenService.getAuthHeader();
        return of(t);

    }
}
