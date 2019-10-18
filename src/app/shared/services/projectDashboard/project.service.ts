import { Injectable } from '@angular/core';
//import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataService } from '../data.service';
import { API } from '../../constants/configuration-constants';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private dataService: DataService
  ) { }

  getProjects(id) {
    return this.dataService.getRequest(API.PROJECTS(id)).then(res => {
        return res;
    });
}
}
