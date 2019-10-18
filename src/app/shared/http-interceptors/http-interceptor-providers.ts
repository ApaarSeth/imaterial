import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { LoaderInterceptor } from './loader-interceptor';

/* multi: true option setting tells Angular that HTTP_INTERCEPTORS is a token for a multiprovider
 * that injects an array of values, rather than a single value.
 */
export const HttpInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: LoaderInterceptor,
        multi: true,
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
    },
    // {
    //     provide: HTTP_INTERCEPTORS,
    //     useClass: CachingInterceptor,
    //     multi: true
    // }
];
