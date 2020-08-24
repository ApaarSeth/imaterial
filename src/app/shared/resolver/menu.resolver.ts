import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CommonService } from '../services/commonService';
import { UserService } from '../services/user.service';

@Injectable()
export class MenuResolver implements Resolve<any> {

    constructor(
        private commonService: CommonService,
        private userService: UserService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.commonService.getMenuData().then(res => {
            const role = localStorage.getItem('role');
            let result = res.data;
            if (role == 'l3') {
                let roleResult = [];
                result.moduleList.forEach(itm => {
                    if (itm.moduleName === 'Dashboard' || itm.moduleName === 'Project Store') {
                        roleResult.push(itm);
                    }
                });
                result.moduleList = roleResult;
            }
            return result;
        });
    }

}