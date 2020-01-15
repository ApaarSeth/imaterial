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
export class ProjectService {
  constructor(private dataService: DataService) {}

  getProjects(organizationId: Number, userId: Number) {
    return this.dataService
      .getRequest(API.PROJECTS(organizationId, userId))
      .then(res => {
        return res;
      });
  }

  getProject(organizationId: Number, projectId: Number) {
    return this.dataService
      .getRequest(API.GETPROJECT(organizationId, projectId))
      .then(res => {
        return res;
      });
  }

  // getProjectById(organizationId:Number,userId:Number,id:number) {
  //   return this.dataService.getRequest(API.PROJECTS(organizationId,userId),id).then(res => {
  //       return res;
  //   });
  // }

  addProjects(projectData: ProjectDetails) {
    projectData.userId = 1;
    projectData.organizationId = 1;
    return this.dataService
      .sendPostRequest(API.ADDPROJECT, projectData)
      .then(res => {
        return res;
      });
  }

  delete(organizationId: Number, projectId: Number) {
    return this.dataService
      .sendPostRequest(API.DELETE(organizationId, projectId), "")
      .then(res => {
        return res;
      });
  }

  updateProjects(
    organizationId: Number,
    projectId: Number,
    projectData: ProjectDetails
  ) {
    return this.dataService
      .sendPostRequest(
        API.UPDATEPROJECT(organizationId, projectId),
        projectData
      )
      .then(res => {
        return res;
      });
  }
}
