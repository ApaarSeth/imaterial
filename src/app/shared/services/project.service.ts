import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { API } from "../constants/configuration-constants";
import { ProjectDetails, ProjetPopupData } from "../models/project-details";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
  providedIn: "root"
})
export class ProjectService {
  constructor(private dataService: DataService,
    public dialog: MatDialog,
  ) { }

  getProjects(organizationId: Number, userId: Number, skipLoader?: boolean) {
    return this.dataService
      .getRequest(API.PROJECTS(organizationId, userId), null, { skipLoader })
      .then(res => {
        return res;
      });
  }

  getUserProjects() {
    return this.dataService
      .getRequest(API.USERPROJECTS)
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

  addProjects(projectData: ProjectDetails, organizationId: number, userId: number) {
    projectData.userId = userId;
    projectData.organizationId = organizationId;
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

  deleteDraftedPo(purchaseOrderId: Number) {
    return this.dataService
      .sendDeleteRequest(API.DELETEDRAFTEDPO(purchaseOrderId), "")
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

  getPincode(pin: number) {
    return this.dataService
      .getRequest(API.GETCITYANDSTATE(pin))
      .then(res => {
        return res;
      });
  }



  /**
   * @description To get the dashboard videos
   */
  getVideos() {
    return this.dataService
      .getRequest(API.DASHBOARD_VIDEOS)
      .then(res => {
        return res;
      });
  }


}
