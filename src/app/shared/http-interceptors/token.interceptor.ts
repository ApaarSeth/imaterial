import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient, HttpBackend, HttpParams } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { TokenService } from '../services/token.service';
import { environment } from '../../../environments/environment';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private reqInProgress = false;

    constructor(private token: TokenService,
        private http: HttpClient,
        private handler: HttpBackend) {
        this.http = new HttpClient(this.handler);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.getToken().pipe(
            mergeMap(token => {
                const authorizationKey = `Bearer ${this.token.getToken()}`;

                if (!request.headers.has('Content-Type')) {
                    // request = request.clone({
                    //   headers: request.headers.set('Content-Type', 'application/json')
                    // });
                }

                if (this.token.getToken()) {
                    request = request.clone({
                        headers: request.headers.set('Authorization', authorizationKey)
                    });
                }

                request = request.clone({
                    // setHeaders: {
                    //     'Access-Control-Allow-Origin': '*',
                    //     'accept': '*/*'
                    // }
                });
                return next.handle(request);
            }));
    }


    getToken(): Observable<any> {
        const t = this.token.getToken();
        return of(t);

    }
}
