import { Injectable } from '@angular/core';
import { auth } from '../models/auth';
import { Subject } from 'rxjs';
// import {DynamicRoutesTypes} from '../../core/shared/constants/dynamic-routes-types';

@Injectable()
export class TokenService {
    headerRole = new Subject<string>();

    /**
     * @important - Do not use any other service in Token Service - can cause circular dependency issue
     * */
    constructor() {



    }

    getAuthHeader() {
        const authorizationKey = `Bearer ${this.getToken()}`;
        const authData = {
            'Authorization': authorizationKey,
            'userId': this.getUserId(),
            'orgId': this.getOrgId(),
            'role': this.getRole()
        }
        return authData;
    }

    setAuthResponseData(data: auth) {
        this.saceAcountStatus(data.accountStatus)
        this.saveAccessToken(data.serviceToken);
        this.saverole(data.role);
        this.saveUserId(data.userId);
        this.saveOrgId(data.orgId);
    }

    saceAcountStatus(accountStatus) {
        if (accountStatus) {
            localStorage.setItem('accountStatus', accountStatus);
        } else {
            localStorage.removeItem('accountStatus');
        }
    }

    /**
     * @description set access token
     * */
    saveAccessToken(token) {
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    }

    /**
    * @description get access token
    * */
    getToken(): string {
        return localStorage.getItem('accessToken');
    }

    saverole(role) {
        if (role) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
        // return this.getRole();
    }


    getRole(): string {
        return localStorage.getItem('role');
    }
    saveUserId(userId) {
        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }
    }
    getUserId(): number {
        return Number(localStorage.getItem('userId'));
    }

    saveOrgId(orgId) {
        if (orgId) {
            localStorage.setItem('orgId', orgId);
        } else {
            localStorage.removeItem('orgId');
        }
    }
    getOrgId(): number {
        return Number(localStorage.getItem('orgId'));
    }

    /**
     * @description get logged in status
     * */
    getLoggedIn(): boolean {
        return //this._isLoggedIn;
    }

    /**
     * @description set logged in status
     * */
    saveLoginStatus(status: boolean) {
        localStorage.setItem('is_loggedIn', (status) ? 'true' : 'false');
        //  this._isLoggedIn = status;
    }




    /**
     * @description set access token, login status and user data information
     * */
    saveLoginCredentials(accessToken: string, userData: any = null, loginStatus: boolean = false) {
        this.saveAccessToken(accessToken);
        this.saveLoginStatus(loginStatus);
    }

    clearToken() {
        this.saveAccessToken(null);
    }

    /**** Login and access token specific functions ends ****/

}
