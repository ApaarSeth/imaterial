import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
    providedIn: "root"
})

export class VisitorService {

    constructor(
        private http: HttpClient
    ) {

    }

    // getIpAddress() {
    //     return this.http
    //         .get("http://ip-api.com/json")
    //         .pipe(
    //             catchError(this.handleError)
    //         );
    // }

    getGEOLocation() {
        //let headers = new HttpHeaders();
        let url = "https://pro.ip-api.com/json?key=nPhN084pCibTSLr";
        return this.http
            .get(url)
            .pipe(
                catchError(this.handleError)
            ).toPromise();
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    }

}