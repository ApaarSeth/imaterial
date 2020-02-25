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
            if (!res.data[0].roleId) {
                this.router.navigate(['/users/organisation/update-info']);
                return false;
            }
        });
        return true;        
    }
}