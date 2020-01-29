import { Injectable } from "@angular/core";
//import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { Address } from "../../models/RFQ/rfq-details";

@Injectable({
  providedIn: "root"
})
export class AddAddressService {
  constructor(private dataService: DataService) {}

  postAddAddress(type: string, id: number, address: Address) {
    return this.dataService
      .sendPostRequest(API.POSTADDADDRESS(type, id), address)
      .then(res => {
        return res;
      });
  }
}
