import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class SubscriptionGaurdService implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    canActivate(): Promise<boolean> {
        const user = localStorage.getItem('userId');
        return this.userService.getUserInfo(user).then(res => {
            if (res.data.isActiveSubscription === 1) {
                return true;
            } else {
                this.router.navigate(['/profile/subscriptions']);
                return false;
            }
        })
    }
}