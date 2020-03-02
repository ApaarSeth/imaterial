import {Injectable} from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { UserService } from '../services/userDashboard/user.service';

@Injectable()
export class UserDataGuardService implements CanActivate {

    constructor(private router: Router,
        private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        
        const userId = localStorage.getItem("userId");
        this._userService.getUserInfo(userId).then(res => {
            if ((res.data[0].firstName === null || res.data[0].firstName === "") && (res.data[0].lastName === null || res.data[0].lastName === "")) {
                this.router.navigate(['/profile/update-info']);
                return false;
            }
        });
        return true;
    }


    /*canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        this.currentUrl = this.router.url;
        this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            this.previousUrl = this.currentUrl;
            this.currentUrl = event.url;
        }
        });
            const userId = localStorage.getItem("userId");
            this._userService.getUserInfo(userId).then(res => {
                if ((res.data[0].firstName === null || res.data[0].firstName === "") && (res.data[0].lastName === null || res.data[0].lastName === "")) {
                    this.router.navigate['/profile/update-info']
                }
            });
            this.router.navigate([this.currentUrl]);
        }
    }*/
}