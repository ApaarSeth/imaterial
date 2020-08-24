import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { DataService } from '../services/data.service';
import { API } from '../constants/configuration-constants';

@Injectable()
export class UserDataGuardService implements CanActivate {
    acceptTerms: boolean;

    constructor(private router: Router,
        private dataService: DataService,
        private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        const userId = localStorage.getItem("userId");
        const uniqueCode = localStorage.getItem("uniqueCode") ? localStorage.getItem("uniqueCode") : null;

        return this._userService.getUserInfo(userId).then(res => {
            if (((res.data.firstName === null || res.data.firstName === "") && (res.data.lastName === null || res.data.lastName === "")) || uniqueCode != null || res.data.isActiveSubscription === 0) {
                return true;
            }
            else {
                this.router.navigate(['/dashboard']);
                return false;
            }
        });
    }
}