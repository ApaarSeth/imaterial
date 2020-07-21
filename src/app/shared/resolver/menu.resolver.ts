import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from '../services/commonService';
import { UserService } from '../services/userDashboard/user.service';

@Injectable()
export class MenuResolver implements Resolve<any> {

    constructor(
        private commonService: CommonService,
        private userService: UserService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.commonService.getMenuData().then(res => {
            if (res.data && res.data.moduleList.length) {
                this.userService.isActivatedSubscription$.next(true);
            } else {
                this.userService.isActivatedSubscription$.next(false);
            }
            return res.data;
        });
    }

}