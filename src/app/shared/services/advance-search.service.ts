import { ProjectService } from './project.service';
import { UserService } from './user.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AdvanceSearchService {

    clearFilter$ = new Subject<boolean>();

    constructor(
        private projectService: ProjectService,
        private commonService: CommonService,
        private userService: UserService
    ) { }


    getDateInFormat(value) {
        if (value) {
            let cdate = new Date(value);
            let y, m, d;
            y = cdate.getFullYear();
            m = cdate.getMonth() + 1;
            d = cdate.getDate();
            m < 10 ? m = '0' + m : m = m;
            d < 10 ? d = '0' + d : d = d;
            return y + '-' + m + '-' + d;
        } else {
            return null;
        }
    }

    getProjects(orgId: number, userId: number) {
        return this.projectService.getProjects(orgId, userId, false).then(res => {
            return res.data.map(itm => ({ ...itm, name: itm.projectName, id: itm.projectId }));
        });
    }

    getSuppliers(orgId: number) {
        return this.commonService.getSuppliers(orgId, false).then(res => {
            return res.data.supplierList.map(itm => ({ ...itm, name: itm.supplierName, id: itm.supplierId }));
        });
    }

    getMaterials() {
        return this.commonService.getMaterials().then(res => {
            return res.map(itm => ({ ...itm, name: itm.materialName, id: itm.materialCode }));
        });
    }

    getAllUsers(orgId) {
        return this.userService.getAllUsers(orgId).then(res => {
            let users = [];
            res.data.activatedProjectList.forEach(itm => {
                if (itm.ProjectUser.firstName !== '' && itm.ProjectUser.lastName !== '') {
                    users.push({ ...itm, name: itm.ProjectUser.firstName + ' ' + itm.ProjectUser.firstName, id: itm.ProjectUser.userId })
                }
            });
            return users;
        });
    }

    getRFPBids() {
        let data = [];
        data.push({ id: 2, name: 'Bid Submitted' });
        data.push({ id: 1, name: 'Not Submitted' });
        return data;
    }

    getPOStatus() {
        let data = [];
        data.push({ id: 2, name: 'Send for Approval' });
        data.push({ id: 3, name: 'Approved' });
        data.push({ id: 1, name: 'Drafted' });
        return data;
    }

    getRaisedDates() {
        let data = [];
        data.push({ id: 0, name: 'From', type: 'raised' });
        data.push({ id: 1, name: 'To', type: 'raised' });
        return data;
    }

    getReqStatus() {
        let data = [];
        data.push({ id: 1, name: 'Open' });
        data.push({ id: 2, name: 'Closed' });
        return data;
    }

    poAmountList() {
        let data = [];
        data.push({ id: 0, name: 'min' });
        data.push({ id: 1, name: 'max' });
        return data;
    }

}