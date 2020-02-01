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
export class UserService {
  constructor(private dataService: DataService) {}

  getRoles() {
    return this.dataService
      .getRequest(API.ROLES)
      .then(res => {
        return res;
      });
  }

  getAllUsers(organisationId:number){
     return this.dataService
      .getRequest(API.ALLUSERS(organisationId))
      .then(res => {
        return res;
      });
  }
}
