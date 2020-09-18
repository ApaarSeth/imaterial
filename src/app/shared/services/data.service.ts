import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from "@angular/common/http";
import { environment } from "../../../environments/environment"
import { ConfigurationConstants } from "../constants/configuration-constants";
import { ResolveData } from "@angular/router";
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
  paymentUrl: string;
  private masterUrl: string;
  private ssoUrl: string;
  private baseStartUrl: string;
  private role: string;
  private userId: string;
  private orgId: string;
  constructor(
    private http: HttpClient,
    private notifier: AppNotificationService,
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
    this.paymentUrl = Utils.paymentUrl() + 'payment/';
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
          this.handleError(err)
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
          this.handleError(err)
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
          this.handleError(err)
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
          this.handleError(err)
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
          this.handleError(err)
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
          this.handleError(err)
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
          this.handleError(err)
      );
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
          this.handleError(err)
      );
  }


  private handleError(err: HttpErrorResponse) {
    if ((!window.navigator.onLine) || ((typeof err === 'object') && (err.status === ErrorCodesConstants.ERROR_HTTP_NO_RESPONSE))) {
      this.notifier.snack('INTERNET CONNECTION ISSUE');
    } else if (err.status === ErrorCodesConstants.ERROR_HTTP_NOT_FOUND || ErrorCodesConstants.ERROR_HTTP_SERVER_ISSUE) {
      this.notifier.snack('Something went wrong')
      throw (err.error)
    } else if (err.status === ErrorCodesConstants.ERROR_HTTP_UNAUTHORIZED) {
      if (err.url.includes('sso/oauth/token')) {
        throw (err.error)
      } else {
        this.notifier.snack(err.error.error.toUpperCase())
        console.log(`Error Staus:${err.status} Error Message:${err.message} Url:${err.url}`)
      }
    } else if (err.status === ErrorCodesConstants.ERROR_HTTP_UNAUTHORIZED_ROLE) {
      this.notifier.snack(err.error.data, 6000)
      console.log(`Error Staus:${err.status} Error Message:${err.message} Url:${err.url}`)
      localStorage.clear();
      window.location.reload();
    }
    // else if (err.status === ErrorCodesConstants.ERROR_HTTP_SERVER_ISSUE) {
    //   this.notifier.snack("Something went wrong")
    //   throw (err.error)
    // }
    else {
      throw (err.error)
    }
  }
}
