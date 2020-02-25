import { Injectable } from "@angular/core";
//import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { ProjectDetails } from "../../models/project-details";
import { IndentVO } from "../../models/indent";
import { UserAdd } from '../../models/user-details';
import { isThisTypeNode } from 'typescript';

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private dataService: DataService) { }

  getRoles() {
    return this.dataService.getRequest(API.ROLES).then(res => {
      return res;
    });
  }

  getAllUsers(organisationId: number) {
    return this.dataService
      .getRequest(API.ALLUSERS(organisationId))
      .then(res => {
        return res;
      });
  }

  addUsers(user: UserAdd) {
    return this.dataService.sendPostRequest(API.ADDUSER, user).then(res => {
      return res;
    });
  }
  updateUsers(user: UserAdd) {
    return this.dataService.sendPostRequest(API.EDITUSER, user).then(res => {
      return res;
    });
  }

  deactivateUser(userId: number) {
    return this.dataService.sendDeleteRequest(API.DEACTIVATEUSER(userId), {}).then(res => {
      return res;
    })
  }

  getUserInfo(userId) {
    return this.dataService.getRequest(API.GET_USER_PROFILE(userId)).then(res => res);
  }

  getTrades() {
    return this.dataService.getRequest(API.GET_ALL_TRADES).then(res => res);
  }

  submitUserDetails(userData) {
    return this.dataService.sendPostRequest(API.SUBMIT_USER_DETAILS, userData)
  }
  getNotification(userId) {
    return this.dataService.getRequest(API.GET_NOTIFICATIONS(userId))
  }
}