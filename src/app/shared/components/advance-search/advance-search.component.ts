import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { CommonService } from '../../services/commonService';
import { ProjectService } from '../../services/projectDashboard/project.service';
import { AdvanceSearchService } from '../../services/advance-search.service';
import { UserService } from '../../services/userDashboard/user.service';
import { MatSelect, MatCheckbox, MatDatepicker } from '@angular/material';

interface rfqRequestData {
    ProjectIDList?: any;
    MaterialCodeList?: any;
    RfqRaisedStartDate?: string;
    RfqRaisedEndDate?: string;
    RfqStatus?: number;
    SupplierIDList?: any;
    UserIDList?: any;
    RfqExpiryStartDate?: string;
    RfqExpiryEndDate?: string;
}

@Component({
    selector: 'advance-search',
    templateUrl: './advance-search.component.html'
})

export class AdvanceSearchComponent implements OnInit {

    @Input('filterType') filterType: string;

    @ViewChild('projectsSelect', { static: false, read: MatSelect }) projectsSelect: MatSelect;
    @ViewChild('suppliersSelect', { static: false, read: MatSelect }) suppliersSelect: MatSelect;
    @ViewChild('materialsSelect', { static: false, read: MatSelect }) materialsSelect: MatSelect;
    @ViewChild('usersSelect', { static: false, read: MatSelect }) usersSelect: MatSelect;

    @ViewChild('bidSubmitted', { static: false, read: MatCheckbox }) bidSubmitted: MatCheckbox;
    @ViewChild('notSubmitted', { static: false, read: MatCheckbox }) notSubmitted: MatCheckbox;

    @ViewChild('raisedFromPicker', { static: false, read: MatDatepicker }) raisedFromPicker: MatDatepicker<string>;
    @ViewChild('raisedToPicker', { static: false, read: MatDatepicker }) raisedToPicker: MatDatepicker<string>;
    @ViewChild('expiryFromPicker', { static: false, read: MatDatepicker }) expiryFromPicker: MatDatepicker<string>;
    @ViewChild('expiryToPicker', { static: false, read: MatDatepicker }) expiryToPicker: MatDatepicker<string>;

    userId: number;
    orgId: number;

    // projects
    projectsData: any;
    selectedProjects: any[];
    projectsList: any[];

    // suppliers
    suppliersData: any;
    selectedSuppliers: any[];
    suppliersList: any[];

    // materials
    materialsData: any;
    selectedMaterials: any[];
    materialsList: any[];

    // users
    usersData: any;
    selectedUsers: any[];
    usersList: any[];

    isBidSubmitted: boolean;
    isNotSubmitted: boolean;

    raisedFromPickerEl: string = '';
    raisedToPickerEl: string = '';
    expiryFromPickerEl: string = '';
    expiryToPickerEl: string = '';

    constructor(
        private commonService: CommonService,
        private projectService: ProjectService,
        private advSearchService: AdvanceSearchService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.orgId = Number(localStorage.getItem('orgId'));
        this.userId = Number(localStorage.getItem('userId'));
        this.selectedProjects = [];
        this.selectedSuppliers = [];
        this.selectedMaterials = [];
        this.selectedUsers = [];
        this.getProjects();
        this.getSuppliers();
        this.getMaterials();
        this.getAllUsers();
    }

    getValueWithMaxWidth(obj) {
        let value = obj.sval ? obj.fval + ' ' + obj.sval : obj.fval;
        return value.length > 20 ? value.substring(0, 20) + '...' : value;
    }

    checkSubmitNotSubmit(isChecked, type, bidSubmitted, notSubmitted) {

        if (isChecked) {
            if (type === '0') {
                notSubmitted._checked = false;
            }
            if (type === '1') {
                bidSubmitted._checked = false;
            }
        }
        this.isBidSubmitted = bidSubmitted._checked;
        this.isNotSubmitted = notSubmitted._checked;
    }

    getDate(event, type) {
        if (type === 'raisedFromPicker') {
            this.raisedFromPickerEl = this.advSearchService.getDateInFormat(event.value);
        }
        if (type === 'raisedToPicker') {
            this.raisedToPickerEl = this.advSearchService.getDateInFormat(event.value);
        }
        if (type === 'expiryFromPicker') {
            this.expiryFromPickerEl = this.advSearchService.getDateInFormat(event.value);
        }
        if (type === 'expiryToPicker') {
            this.expiryToPickerEl = this.advSearchService.getDateInFormat(event.value);
        }
    }

    search(query: string, type: string) {
        let result = this.select(query, type);
        if (type === 'projects') {
            this.projectsList = result;
        }
        if (type === 'suppliers') {
            this.suppliersList = result;
        }
        if (type === 'materials') {
            this.materialsList = result;
        }
        if (type === 'users') {
            this.usersList = result;
        }
    }

    select(query: string, type: string): string[] {
        let result: string[] = [];
        if (type === 'projects') {
            result = this.getProjectSelectQuery(query);
        }
        if (type === 'suppliers') {
            result = this.getSupplierSelectQuery(query);
        }
        if (type === 'materials') {
            result = this.getMaterialsSelectQuery(query);
        }
        if (type === 'users') {
            result = this.getUsersSelectQuery(query);
        }
        return result;
    }

    getProjectSelectQuery(query) {
        let result: string[] = [];
        for (let a of this.projectsData) {
            if (a.projectName.toLowerCase().indexOf(query) > -1) {
                result.push(a);
            }
        }
        return result;
    }

    getSupplierSelectQuery(query) {
        let result: string[] = [];
        for (let a of this.suppliersData) {
            if (a.supplier_name.toLowerCase().indexOf(query) > -1) {
                result.push(a);
            }
        }
        return result;
    }

    getMaterialsSelectQuery(query) {
        let result: string[] = [];
        for (let a of this.materialsData) {
            if (a.materialName.toLowerCase().indexOf(query) > -1) {
                result.push(a);
            }
        }
        return result;
    }

    getUsersSelectQuery(query) {
        let result: string[] = [];
        for (let a of this.materialsData) {
            if (a.ProjectUser.userId.toLowerCase().indexOf(query) > -1) {
                result.push(a);
            }
        }
        return result;
    }

    // get projects value on page load

    getProjects() {
        this.projectService.getProjects(this.orgId, this.userId, false).then(res => {
            if (res.data.length) {
                this.projectsData = res.data;
                this.projectsList = res.data;
            }
        });
    }

    getSuppliers() {
        this.commonService.getSuppliers(this.orgId, false).then(res => {
            if (res.data.length) {
                this.suppliersData = res.data;
                this.suppliersList = res.data;
            }
        });
    }

    getMaterials() {
        this.commonService.getMaterials().then(res => {
            if (res.length) {
                this.materialsData = res;
                this.materialsList = res;
            }
        });
    }

    getAllUsers() {
        this.userService.getAllUsers(this.orgId).then(res => {
            this.usersData = res.data.activatedProjectList;
            this.usersList = res.data.activatedProjectList;
        });
    }

    // search value function

    searchValue(obj, type: string) {
        if (type === 'projects') {
            this.selectedProjects = this.advSearchService.searchProjectValue(obj, this.selectedProjects);
        }
        if (type === 'suppliers') {
            this.selectedSuppliers = this.advSearchService.searchSupplierValue(obj, this.selectedSuppliers);
        }
        if (type === 'materials') {
            this.selectedMaterials = this.advSearchService.searchMaterialsValue(obj, this.selectedMaterials);
        }
        if (type === 'users') {
            this.selectedUsers = this.advSearchService.searchUsersValue(obj, this.selectedUsers);
        }
    }

    getFilterRequest() {
        let data = this.filterRequest();
        if (this.filterType === 'rfq') {
            // console.log(JSON.stringify(data));
            this.advSearchService.RFQFilterRequest$.next(data);
        }
    }

    getFilterExportRequest() {
        let data = this.filterRequest();
        if (this.filterType === 'rfq') {
            this.advSearchService.RFQFilterExportRequest$.next(data);
        }
    }

    filterRequest() {
        let data: rfqRequestData = {};
        data.RfqExpiryStartDate = this.expiryFromPickerEl ? this.expiryFromPickerEl : null;
        data.RfqExpiryEndDate = this.expiryToPickerEl ? this.expiryToPickerEl : null;
        data.RfqRaisedStartDate = this.raisedFromPickerEl ? this.raisedFromPickerEl : null;
        data.RfqRaisedEndDate = this.raisedToPickerEl ? this.raisedToPickerEl : null;

        if (this.isBidSubmitted) {
            data.RfqStatus = 1;
        }
        if (this.isNotSubmitted) {
            data.RfqStatus = 0;
        }

        data.ProjectIDList = this.advSearchService.getFinalList(this.selectedProjects, 'projects');
        data.MaterialCodeList = this.advSearchService.getFinalList(this.selectedMaterials, 'materials');
        data.SupplierIDList = this.advSearchService.getFinalList(this.selectedSuppliers, 'suppliers');
        data.UserIDList = this.advSearchService.getFinalList(this.selectedUsers, 'users');

        return data;
    }

    removeId(id, type) {
        if (type === 'projects') {
            this.projectsSelect.options.find(opt => opt.value.projectId === id).deselect();
            this.projectsList = this.projectsData;
        }
        if (type === 'suppliers') {
            this.suppliersSelect.options.find(opt => opt.value.supplierId === id).deselect();
            this.suppliersList = this.suppliersData;
        }
        if (type === 'materials') {
            this.materialsSelect.options.find(opt => opt.value.materialCode === id).deselect();
            this.materialsList = this.materialsData;
        }
        if (type === 'users') {
            this.usersSelect.options.find(opt => opt.value.ProjectUser.userId === id).deselect();
            this.usersList = this.usersData;
        }
    }

    clearFilter() {
        this.expiryFromPickerEl = '';
        this.expiryToPickerEl = '';
        this.raisedFromPickerEl = '';
        this.raisedToPickerEl = '';

        this.isBidSubmitted = false;
        this.isNotSubmitted = false;

        this.selectedProjects = [];
        this.selectedMaterials = [];
        this.selectedSuppliers = [];
        this.selectedUsers = [];

        this.projectsSelect.options.forEach(opt => opt.deselect());
        this.suppliersSelect.options.forEach(opt => opt.deselect());
        this.materialsSelect.options.forEach(opt => opt.deselect());
        this.usersSelect.options.forEach(opt => opt.deselect());

        this.bidSubmitted.checked = false;
        this.notSubmitted.checked = false;

        this.raisedFromPicker._datepickerInput.value = '';
        this.raisedToPicker._datepickerInput.value = '';
        this.expiryFromPicker._datepickerInput.value = '';
        this.expiryToPicker._datepickerInput.value = '';
    }

}