import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from "@angular/common/http";
import { environment } from "../../../environments/environment"
//import { ErrorCodesConstants } from '../constants/error-codes-constants';
import { isUndefined } from "util";
//import { NotificationService } from './notification-service';
//import { StaticText } from '../constants/static-text';
//import { LoggerService } from './logger.service';
//import { TokenService } from './token.service';
import { ConfigurationConstants } from "../constants/configuration-constants";
import { ResolveData, Router } from "@angular/router";
import { DataServiceOptions } from "../models/data-service-options";
import { Utils } from '../helpers/utils';
import { ErrorCodesConstants } from '../constants/error-code-constant';
import { AppNotificationService } from './app-notification.service';
//import { NotificationService } from './notification-service';

@Injectable({
  providedIn: "root"
})
export class DataService {
  private baseUrl: string;
  private baseStartUrl: string;
  private masterUrl: string;
  private ssoUrl: string;
  private role: string;
  private userId: string;
  private orgId: string;

  constructor(
    private http: HttpClient,
    private notifier: AppNotificationService,
    //private token:environment TokenService,
    private router: Router
  ) {
    // this.baseUrl = environment.url + "/";
    // this.masterUrl = environment.masterUrl + "/";
    // this.ssoUrl = environment.ssoUrl + "/";
    this.baseStartUrl = Utils.baseUrl();
    this.baseUrl = this.baseStartUrl + "im/";
    this.masterUrl = this.baseStartUrl + "mm/";
    this.ssoUrl = this.baseStartUrl + "sso/";
    this.role = localStorage.getItem("role");
    this.userId = localStorage.getItem("userId");
    this.orgId = localStorage.getItem("orgId");
  }

  getRequest(
    url: string,
    params: HttpParams = new HttpParams(),
    reqOptions: DataServiceOptions = null
  ): ResolveData {
    let headers = new HttpHeaders();
    headers = headers.append("Access-Control-Allow-Origin", "*");
    headers = headers.append("accept", "*/*");

    if (reqOptions) {
      if (reqOptions.skipLoader) {
        headers = headers.append(
          ConfigurationConstants.HEADER_SKIP_LOADER,
          "1"
        );
      }
      if (reqOptions.cache) {
        headers = headers.append(
          ConfigurationConstants.HEADER_CACHE_REQUEST,
          "1"
        );
      }
      if (reqOptions.headers) {
        const hdrs = reqOptions.headers.split(",");

        headers = headers.append(hdrs[0], hdrs[1]);
      }
    }

    const requestUrl =
      reqOptions && reqOptions.requestURL
        ? reqOptions.requestURL
        : this.baseUrl;
    const options = { params, headers };

    return this.http
      .get(requestUrl + url, options)
      .toPromise()
      .then(
        res => res,
        err =>
          this.handleError(err, reqOptions && reqOptions.skipLoader === true)
      );
  }

  sendPostRequest(
    url: string,
    params: any,
    reqOptions: DataServiceOptions = null
  ): Promise<any> {
    let headers = new HttpHeaders();
    headers = headers.append("Access-Control-Allow-Origin", "*");
    headers = headers.append("accept", "*/*");
    if (reqOptions) {
      if (reqOptions.skipLoader) {
        headers = headers.append(
          ConfigurationConstants.HEADER_SKIP_LOADER,
          "1"
        );
      }
      if (reqOptions.cache) {
        headers = headers.append(
          ConfigurationConstants.HEADER_CACHE_REQUEST,
          "1"
        );
      }

      if (reqOptions.headers) {
        const hdrs = reqOptions.headers.split(",");

        headers = headers.append(hdrs[0], hdrs[1]);
      }
    }

    const requestUrl =
      reqOptions && reqOptions.requestURL
        ? reqOptions.requestURL
        : this.baseUrl;
    const options = { headers };

    return this.http
      .post(requestUrl + url, params, options)
      .toPromise()
      .then(
        res => res as any,
        err =>
          this.handleError(err, reqOptions && reqOptions.skipLoader === true)
      );
  }

  sendPutRequest(
    url: string,
    params: any,
    reqOptions: DataServiceOptions = null
  ): Promise<any> {
    // LoggerService.debug(url, params);
    let headers = new HttpHeaders();
    if (reqOptions) {
      if (reqOptions.skipLoader) {
        headers = headers.append(
          ConfigurationConstants.HEADER_SKIP_LOADER,
          "1"
        );
      }
    }
    const reqURL =
      reqOptions && reqOptions.requestURL
        ? reqOptions.requestURL
        : this.baseUrl;
    return this.http
      .put(reqURL + url, params, { headers: headers })
      .toPromise()
      .then(
        res => res as any,
        err =>
          this.handleError(err, reqOptions && reqOptions.skipLoader === true)
      );
  }

  sendDeleteRequest(
    url: string,
    params: any,
    reqOptions: DataServiceOptions = null
  ): Promise<any> {
    // LoggerService.debug(url, params);
    let headers = new HttpHeaders();
    headers = headers.append("Access-Control-Allow-Origin", "*");
    headers = headers.append("accept", "*/*");
    if (reqOptions) {
      if (reqOptions.skipLoader) {
        headers = headers.append(
          ConfigurationConstants.HEADER_SKIP_LOADER,
          "1"
        );
      }
    }
    const reqURL =
      reqOptions && reqOptions.requestURL
        ? reqOptions.requestURL
        : this.baseUrl;
    return this.http
      .delete(reqURL + url, { headers: headers, params: params })
      .toPromise()
      .then(
        res => res as any,
        err =>
          this.handleError(err, reqOptions && reqOptions.skipLoader === true)
      );
  }

  getRequestMaster(
    url: string,
    params: HttpParams = new HttpParams(),
    reqOptions: DataServiceOptions = null
  ): ResolveData {
    let headers = new HttpHeaders();
    headers = headers.append("Access-Control-Allow-Origin", "*");
    headers = headers.append("accept", "*/*");
    headers = headers.append("Authorization", "admin");

    if (reqOptions) {
      if (reqOptions.skipLoader) {
        headers = headers.append(
          ConfigurationConstants.HEADER_SKIP_LOADER,
          "1"
        );
      }
      if (reqOptions.cache) {
        headers = headers.append(
          ConfigurationConstants.HEADER_CACHE_REQUEST,
          "1"
        );
      }
      if (reqOptions.headers) {
        const hdrs = reqOptions.headers.split(",");

        headers = headers.append(hdrs[0], hdrs[1]);
      }
    }

    const requestUrl =
      reqOptions && reqOptions.requestURL
        ? reqOptions.requestURL
        : this.masterUrl;
    const options = { params, headers };

    return this.http
      .get(requestUrl + url, options)
      .toPromise()
      .then(
        res => res,
        err =>
          this.handleError(err, reqOptions && reqOptions.skipLoader === true)
      );
  }

  sendPostRequestSso(
    url: string,
    params: any,
    reqOptions: DataServiceOptions = null
  ): Promise<any> {
    let headers = new HttpHeaders();
    headers = headers.append("accept", "*/*");
    //headers = headers.append( 'Authorization', 'admin');
    headers = headers.append(
      "Authorization",
      "Basic " + btoa("fooClientIdPassword:secret")
    );
    if (reqOptions) {
      if (reqOptions.skipLoader) {
        headers = headers.append(
          ConfigurationConstants.HEADER_SKIP_LOADER,
          "1"
        );
      }
      if (reqOptions.cache) {
        headers = headers.append(
          ConfigurationConstants.HEADER_CACHE_REQUEST,
          "1"
        );
      }

      if (reqOptions.headers) {
        const hdrs = reqOptions.headers.split(",");

        headers = headers.append(hdrs[0], hdrs[1]);
      }
    }

    const requestUrl =
      reqOptions && reqOptions.requestURL ? reqOptions.requestURL : this.ssoUrl;
    const options = { headers };

    return this.http
      .post(requestUrl + url, params, options)
      .toPromise()
      .then(
        res => res as any,
        err =>
          this.handleError(err, reqOptions && reqOptions.skipLoader === true)
      );
  }

  sendPostRequestSsoEncodedUrl(
    url: string,
    params: any,
    reqOptions: DataServiceOptions = null
  ): Promise<any> {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      "Basic " + btoa("fooClientIdPassword:secret")
    );
    headers = headers.append(
      "Content-type",
      "application/x-www-form-urlencoded; charset=utf-8"
    );
    if (reqOptions) {
      if (reqOptions.skipLoader) {
        headers = headers.append(
          ConfigurationConstants.HEADER_SKIP_LOADER,
          "1"
        );
      }
      if (reqOptions.cache) {
        headers = headers.append(
          ConfigurationConstants.HEADER_CACHE_REQUEST,
          "1"
        );
      }

      if (reqOptions.headers) {
        const hdrs = reqOptions.headers.split(",");

        headers = headers.append(hdrs[0], hdrs[1]);
      }
    }

    const requestUrl =
      reqOptions && reqOptions.requestURL ? reqOptions.requestURL : this.ssoUrl;
    const options = { headers };

    return this.http
      .post(requestUrl + url, params, options)
      .toPromise()
      .then(
        res => res as any,
        err =>
          this.handleError(err, reqOptions && reqOptions.skipLoader === true)
      );
  }

  private handleError(err: HttpErrorResponse, skipErrorNotify = false) {
    // if ((!window.navigator.onLine) || ((typeof err === 'object') && (err.status === ErrorCodesConstants.ERROR_HTTP_NO_RESPONSE))) {
    //     this.notifier.clearAllNotifications();
    //     this.notifier.notify("INTERNET CONNECTION ISSUE");
    //     throw undefined;
    // }
    // if (err && err.error) {
    //   if (
    //     err.error.error && err.error.error === "Unauthorized" &&
    //     err.error.httpStatusCode === 401
    //   ) {
    //     localStorage.clear();
    //     window.location.reload();
    //   }
    // }

    // if (
    //   err.error.error === "Unauthorized" &&
    //   err.error.httpStatusCode === 401
    // ) {
    //   localStorage.clear();
    //   window.location.reload();
    // }


    if ((!window.navigator.onLine) || ((typeof err === 'object') && (err.status === ErrorCodesConstants.ERROR_HTTP_NO_RESPONSE))) {
      this.notifier.snack('INTERNET CONNECTION ISSUE');
      throw undefined;
    }


    if (err.status === ErrorCodesConstants.ERROR_HTTP_NOT_FOUND) {
      throw err;
    }

    // if (err.error.error === 'Unauthorized' && err.error.httpStatusCode === 401) {
    //     localStorage.clear();
    //     window.location.reload();
    // }
    // if (data) {
    //   this.notifier.snack(err.error)

    // }

    // throw err.error || err;

    // if (err) {

    // }
    // //this.notifier.notify(err.error.message);
    // throw err;
  }


  resetPasswordSSOPOST(
    url: string,
    params: any,
    reqOptions: DataServiceOptions = null
  ): Promise<any> {
    let headers = new HttpHeaders();
    let ssotoken = localStorage.getItem('SSO_ACCESS_TOKEN');
    headers = headers.append("accept", "*/*");
    //headers = headers.append( 'Authorization', 'admin');
    headers = headers.append(
      "Authorization",
      "Bearer " + ssotoken
    );
    if (reqOptions) {
      if (reqOptions.skipLoader) {
        headers = headers.append(
          ConfigurationConstants.HEADER_SKIP_LOADER,
          "1"
        );
      }
      if (reqOptions.cache) {
        headers = headers.append(
          ConfigurationConstants.HEADER_CACHE_REQUEST,
          "1"
        );
      }

      if (reqOptions.headers) {
        const hdrs = reqOptions.headers.split(",");

        headers = headers.append(hdrs[0], hdrs[1]);
      }
    }

    const requestUrl =
      reqOptions && reqOptions.requestURL ? reqOptions.requestURL : this.ssoUrl;
    const options = { headers };

    return this.http
      .post(requestUrl + url, params, options)
      .toPromise()
      .then(
        res => res as any,
        err =>
          this.handleError(err, reqOptions && reqOptions.skipLoader === true)
      );
  }
}
