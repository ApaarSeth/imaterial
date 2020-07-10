import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
import { API } from "../../constants/configuration-constants";
import { UserAdd } from '../../models/user-details';
import { Router } from '@angular/router';
import { NotificationInt } from '../../models/notification'
import { Subject } from 'rxjs';
@Injectable({
  providedIn: "root"
})
export class UserService {
  UpdateProfileImage = new Subject<string>();
  constructor(private dataService: DataService,
    private _router: Router) { }

  get isLoggedIn() {
    return localStorage.getItem('ServiceToken') != null;
  }

  getRoles() {
    return this.dataService.getRequest(API.ROLES).then(res => res);
  }

  getAllUsers(organisationId: number) {
    return this.dataService
      .getRequest(API.ALLUSERS(organisationId))
      .then(res => res);
  }

  getTurnOverList() {
    return this.dataService
      .getRequest(API.TURNOVERLIST)
      .then(res => res);
  }
  addUsers(user: UserAdd) {
    return this.dataService.sendPostRequest(API.ADDUSER, user)
  }
  postTerms(id) {
    return this.dataService.sendPostRequest(API.TERMS(id), {})
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

  getUserInfo(userId, skipLoader?: boolean) {
    return this.dataService.getRequest(API.GET_USER_PROFILE(userId), null, { skipLoader: skipLoader }).then(res => res)
  }

  getTrades() {
    return this.dataService.getRequest(API.GET_ALL_TRADES).then(res => res);
  }

  submitUserDetails(userData) {
    return this.dataService.sendPostRequest(API.SUBMIT_USER_DETAILS, userData)
  }


  getUserInfoUniqueCode(uniqueCode) {
    return this.dataService.getRequest(API.GET_USER_INFO_UNIQUE_CODE(uniqueCode));
  }

  getDashboardData(data) {
    return this.dataService.sendPostRequest(API.GET_DASHBOARD_DATA, data);
  }

  verifyEMAIL(email) {
    return this.dataService.getRequest(API.VERIFYEMAIL(email)).then(res => { return res });
  }
  logoutUser() {
    this._router.navigate(['/auth/login']).then(_ => {
      localStorage.clear();
    });
  }
}