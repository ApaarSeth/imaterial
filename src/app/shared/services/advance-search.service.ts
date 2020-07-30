import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AdvanceSearchService {

    RFQFilterRequest$ = new Subject<any>();
    RFQFilterExportRequest$ = new Subject<any>();
    POFilterRequest$ = new Subject<any>();

    constructor() { }

    // search project value

    searchProjectValue(obj, selectedProjects) {
        let result = selectedProjects;
        if (result.length) {
            let x = 0;
            result.forEach((itm, index) => {
                if (itm.projectId === obj.projectId) {
                    result.splice(index, 1);
                    x = 1;
                }
            });
            if (x == 0) {
                result.push(obj);
            }
        } else {
            result.push(obj);
        }
        return result;
    }


    // search supplier value

    searchSupplierValue(obj, selectedSuppliers) {
        let result = selectedSuppliers;
        if (result.length) {
            let x = 0;
            result.forEach((itm, index) => {
                if (itm.supplierId === obj.supplierId) {
                    result.splice(index, 1);
                    x = 1;
                }
            });
            if (x == 0) {
                result.push(obj);
            }
        } else {
            result.push(obj);
        }
        return result;
    }

    // search materials value

    searchMaterialsValue(obj, selectedMaterials) {
        let result = selectedMaterials;
        if (result.length) {
            let x = 0;
            result.forEach((itm, index) => {
                if (itm.materialCode === obj.materialCode) {
                    result.splice(index, 1);
                    x = 1;
                }
            });
            if (x == 0) {
                result.push(obj);
            }
        } else {
            result.push(obj);
        }
        return result;
    }

    searchUsersValue(obj, selectedUsers) {
        let result = selectedUsers;
        if (result.length) {
            let x = 0;
            result.forEach((itm, index) => {
                if (itm.ProjectUser.userId === obj.ProjectUser.userId) {
                    result.splice(index, 1);
                    x = 1;
                }
            });
            if (x == 0) {
                result.push(obj);
            }
        } else {
            result.push(obj);
        }
        return result;
    }


    getFinalList(data, type) {
        let result = [];
        if (data.length) {
            if (type === 'projects') {
                data.forEach(item => {
                    result.push(item.projectId.toString());
                });
            }
            if (type === 'suppliers') {
                data.forEach(item => {
                    result.push(item.supplierId.toString());
                });
            }
            if (type === 'materials') {
                data.forEach(item => {
                    result.push(item.materialCode.toString());
                });
            }
            if (type === 'users' || type === 'approvers' || type === 'created') {
                data.forEach(item => {
                    result.push(item.ProjectUser.userId.toString());
                });
            }
        }
        return result;
    }

    getDateInFormat(value) {
        let cdate = new Date(value);
        let y, m, d;
        y = cdate.getFullYear();
        m = cdate.getMonth() + 1;
        d = cdate.getDate();
        m < 10 ? m = '0' + m : m = m;
        d < 10 ? d = '0' + d : d = d;
        return y + '-' + m + '-' + d;
    }

}