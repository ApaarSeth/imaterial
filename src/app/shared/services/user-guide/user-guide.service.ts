import { Injectable } from "@angular/core";
//import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { ProjectIds } from "../../models/project-details";
import { RfqProjectSubmit } from "../../models/RFQ/rfqBids";
import { Suppliers } from "../../models/RFQ/suppliers";
import { AddRFQ } from "../../models/RFQ/rfq-details";
import { SendRfqObj } from "../../models/RFQ/rfq-details-supplier";

@Injectable({
  providedIn: "root"
})
export class UserGuideService {
  constructor(private dataService: DataService) { }

  sendUserGuideFlag(data) {
    return this.dataService.sendPostRequest(API.SENDUSERGUIDEFLAG, data).then(res => {
      return res;
    })
  }
  getUserGuideFlag() {
    return this.dataService.getRequest(API.GETUSERGUIDEFLAG).then(res => {
      return res;
    });
  }

  userGetReleaseNote() {
    return this.dataService.getRequest(API.GETRELEASENOTES).then(res => {
      return res;
    });
  }
  sendReleaseNoteData(obj) {
    return this.dataService.sendPostRequest(API.SENDRELEASENOTE, obj).then(res => {
      return res;
    });
  }
}
