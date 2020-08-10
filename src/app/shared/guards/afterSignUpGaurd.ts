import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/userDashboard/user.service';

@Injectable()
export class AfterSignUpGuardService implements CanActivate {

    constructor(private router: Router,
        private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

        const userId = localStorage.getItem("userId");
        return this._userService.getUserInfo(userId).then(res => {
            // if ((res.data[ 0 ].firstName !== null || res.data[ 0 ].firstName !== "") && (res.data[ 0 ].lastName !== null || res.data[ 0 ].lastName !== "") && res.data[ 0 ].isPlanAvailable === 0) {
            //     return true;
            // }
            if ((res.data[0].firstName !== null || res.data[0].firstName !== "") && (res.data[0].lastName !== null || res.data[0].lastName !== "") && res.data[0].isActiveSubscription === 1) {
                return true;
            }
            else {
                if (res.data[0].isActiveSubscription === 0 && res.data[0].isFreeTrialSubscription === 0 && res.data[0].isPlanAvailable === 1) {
                    // this.router.navigate([ '/subscriptions/trial-expiry' ]);
                    this.router.navigate(['/profile/subscriptions']);
                    return false;
                }
                else if (res.data[0].isActiveSubscription === 2 && res.data[0].isPlanAvailable === 1) {
                    this.router.navigate(['/subscriptions/trial-expiry']);
                    return false;
                } else {
                    if (res.data[0].isPlanAvailable === 0) {
                        if ((res.data[0].firstName !== "") && (res.data[0].lastName !== "")) {
                            return true;
                        }
                    } else {
                        this.router.navigate(['/profile/update-info']);
                        return false;
                    }
                }

            }

        });
    }
}