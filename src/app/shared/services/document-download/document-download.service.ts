import { Injectable } from "@angular/core";
//import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { SendRfqObj } from "../../models/RFQ/rfq-details-supplier";

@Injectable({
  providedIn: "root"
})
export class DocumentUploadService {
  constructor(private dataService: DataService) {}

  postDocumentUpload(data) {
    return this.dataService
      .sendPostRequest(API.POSTDOCUMENTUPLOAD, data)
      .then(res => {
        return res;
      });
  }

  POSTSUPPLIERDOCUMENTUPLOAD(data){
    return this.dataService
    .sendPostRequest(API.POSTSUPPLIERDOCUMENTUPLOAD, data)
    .then(res => {
      return res;
    });
  }
}
