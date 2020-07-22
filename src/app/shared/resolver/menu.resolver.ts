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
            return res.data;
        });
    }

}