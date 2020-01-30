import { Injectable } from "@angular/core";
//import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { ProjectDetails } from "../../models/project-details";
import { IndentVO } from "../../models/indent";

@Injectable({
  providedIn: "root"
})
export class IndentService {
  constructor(private dataService: DataService) { }

  raiseIndent(projectId: Number, indentData: IndentVO[]) {
    return this.dataService.sendPostRequest(
      API.RAISEINDENT(projectId),
      indentData
    );
  }

  getIndentList(projectId: Number) {
    return this.dataService.getRequest(API.GETINDENTLIST(projectId));
  }

  getSingleIndent(indentId: Number) {
    return this.dataService.getRequest(API.GETSINGLEINDENT(indentId));
  }
}
