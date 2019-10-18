import {Injectable} from '@angular/core';
// import {DynamicRoutesTypes} from '../../core/shared/constants/dynamic-routes-types';

@Injectable()
export class TokenService {

     
    /**
     * @important - Do not use any other service in Token Service - can cause circular dependency issue
     * */
    constructor() {


       
    }
 
  
    /**
     * @description get access token
     * */
    getToken(): string {
        return localStorage.getItem('accessToken');
    } 

    /**
     * @description set access token
     * */
    saveAccessToken(token): string {
        if(token){
            localStorage.setItem('accessToken', token);
        }else{
            localStorage.removeItem('accessToken');
        }
        return this.getToken();
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
    saveLoginStatus(status: boolean): boolean {
        localStorage.setItem('is_loggedIn', (status) ? 'true' : 'false');
      //  this._isLoggedIn = status;
        return this.getLoggedIn();
    }
 

  

    /**
     * @description set access token, login status and user data information
     * */
    saveLoginCredentials(accessToken: string, userData: any = null, loginStatus: boolean = false) {
        this.saveAccessToken(accessToken);
        this.saveLoginStatus(loginStatus);
    }

    clearToken(){
        this.saveAccessToken(null);
    }

    /**** Login and access token specific functions ends ****/
    
}
