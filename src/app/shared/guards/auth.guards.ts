import {Injectable} from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { UserService } from '../services/userDashboard/user.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router,
        private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // if (!localStorage.getItem('ServiceToken')) {
        //     this.router.navigate(['/auth/login']);
        //     return false;
        // }
        // return true;

        if (!this._userService.isLoggedIn) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}