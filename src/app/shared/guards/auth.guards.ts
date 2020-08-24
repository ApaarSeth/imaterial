import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router,
        private token: TokenService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // if (!localStorage.getItem('ServiceToken')) {
        //     this.router.navigate(['/auth/login']);
        //     return false;
        // }
        // return true;

        if (!this.token.getToken()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}