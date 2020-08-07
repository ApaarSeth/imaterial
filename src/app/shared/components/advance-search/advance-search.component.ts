import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { CommonService } from '../../services/commonService';
import { ProjectService } from '../../services/projectDashboard/project.service';
import { AdvanceSearchService } from '../../services/advance-search.service';
import { UserService } from '../../services/userDashboard/user.service';
import { MatSelect, MatCheckbox, MatDatepicker, MatInput } from '@angular/material';
import { MatAccordion } from '@angular/material/expansion';

interface rfqRequestData {
    projectIDList?: any;
    materialCodeList?: any;
    rfqRaisedStartDate?: string;
    rfqRaisedEndDate?: string;
    rfqStatus?: any;
    supplierIDList?: any;
    userIDList?: any;
    rfqExpiryStartDate?: string;
    rfqExpiryEndDate?: string;
}

interface poRequestData {
    poRaisedStartDate?: string;
    poRaisedEndDate?: string;
    poStatus?: any;
    projectIdList?: any;
    materialCodeList?: any;
    supplierIdList?: any;
    poCreatedByList?: any;
    poApprovedByList?: any;
    poAmountMin?: number;
    poAmountMax?: number;
}

interface indentRequestData {
    projectId?: number;
    materialCodeList?: any;
    indentRaisedByList?: any;
    indentStatus?: any;
    indentRaisedStartDate?: string;
    indentRaisedEndDate?: string;
    indentRequestStartDate?: string;
    indentRequestEndDate?: string;
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
    @ViewChild('approversSelect', { static: false, read: MatSelect }) approversSelect: MatSelect;
    @ViewChild('createdSelect', { static: false, read: MatSelect }) createdSelect: MatSelect;

    @ViewChild('bidSubmitted', { static: false, read: MatCheckbox }) bidSubmitted: MatCheckbox;
    @ViewChild('notSubmitted', { static: false, read: MatCheckbox }) notSubmitted: MatCheckbox;

    @ViewChild('raisedFromPicker', { static: false, read: MatDatepicker }) raisedFromPicker: MatDatepicker<string>;
    @ViewChild('raisedToPicker', { static: false, read: MatDatepicker }) raisedToPicker: MatDatepicker<string>;
    @ViewChild('expiryFromPicker', { static: false, read: MatDatepicker }) expiryFromPicker: MatDatepicker<string>;
    @ViewChild('expiryToPicker', { static: false, read: MatDatepicker }) expiryToPicker: MatDatepicker<string>;

    @ViewChild('minAmt', { static: false, read: MatInput }) minAmt: MatInput;
    @ViewChild('maxAmt', { static: false, read: MatInput }) maxAmt: MatInput;

    @ViewChild('po1', { static: false, read: MatCheckbox }) po1: MatCheckbox;
    @ViewChild('po2', { static: false, read: MatCheckbox }) po2: MatCheckbox;
    @ViewChild('po3', { static: false, read: MatCheckbox }) po3: MatCheckbox;
    @ViewChild('indentOpen', { static: false, read: MatCheckbox }) indentOpen: MatCheckbox;
    @ViewChild('indentClosed', { static: false, read: MatCheckbox }) indentClosed: MatCheckbox;

    @ViewChild('requestedFromPicker', { static: false, read: MatDatepicker }) requestedFromPicker: MatDatepicker<string>;
    @ViewChild('requestedToPicker', { static: false, read: MatDatepicker }) requestedToPicker: MatDatepicker<string>;

    @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;

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

    // approvers
    selectedApprovers: any[];
    approversList: any[];

    createdList: any[];
    selectedCreated: any[];

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
        this.selectedApprovers = [];
        this.selectedCreated = [];
        this.getProjects();
        this.getSuppliers();
        this.getMaterials();
        this.getAllUsers();
    }

    getValueWithMaxWidth(obj) {
        let value = obj.sval ? obj.fval + ' ' + obj.sval : obj.fval;
        return value.length > 20 ? value.substring(0, 20) + '...' : value;
    }

    checkSubmitNotSubmit(bidSubmitted, notSubmitted) {

        // if (isChecked) {
        //     if (type === '0') {
        //         notSubmitted._checked = false;
        //     }
        //     if (type === '1') {
        //         bidSubmitted._checked = false;
        //     }
        // }
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
        if (type === 'approvers') {
            this.approversList = result;
        }
        if (type === 'created') {
            this.createdList = result;
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
        if (type === 'users' || type === 'approvers' || type === 'created') {
            result = this.getUsersSelectQuery(query);
        }
        return result;
    }

    getProjectSelectQuery(query) {
        let result: string[] = [];
        for (let a of this.projectsData) {
            if (a.projectName.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                result.push(a);
            }
        }
        return result;
    }

    getSupplierSelectQuery(query) {
        let result: string[] = [];
        for (let a of this.suppliersData) {
            if (a.supplier_name.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                result.push(a);
            }
        }
        return result;
    }

    getMaterialsSelectQuery(query) {
        let result: string[] = [];
        for (let a of this.materialsData) {
            if (a.materialName.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                result.push(a);
            }
        }
        return result;
    }

    getUsersSelectQuery(query) {
        let result: string[] = [];
        for (let a of this.usersData) {
            let userName = a.ProjectUser.firstName + ' ' + a.ProjectUser.lastName;
            if (userName.toLowerCase().indexOf(query.toLowerCase()) > -1) {
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
            this.usersData = this.getUserWithName(res.data.activatedProjectList);
            this.usersList = this.getUserWithName(res.data.activatedProjectList);
            this.approversList = this.getUserWhoCanApprove(res.data.activatedProjectList);
            this.createdList = this.getUserWithName(res.data.activatedProjectList);
        });
    }

    getUserWhoCanApprove(data) {
        let result = [];
        data.forEach(itm => {
            if (itm.ProjectUser.firstName !== '' && itm.ProjectUser.lastName !== '') {
                if (itm.ProjectUser.roleName !== 'l3') {
                    result.push(itm);
                }
            }
        });
        return result;
    }

    getUserWithName(data) {
        let result = [];
        data.forEach(itm => {
            if (itm.ProjectUser.firstName !== '' || itm.ProjectUser.lastName !== '') {
                result.push(itm);
            }
        });
        return result;
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
        if (type === 'approvers') {
            this.selectedApprovers = this.advSearchService.searchUsersValue(obj, this.selectedApprovers);
        }
        if (type === 'created') {
            this.selectedCreated = this.advSearchService.searchUsersValue(obj, this.selectedCreated);
        }
    }

    getFilterRequest() {
        let data;
        if (this.filterType === 'rfq') {
            data = this.rfqFilterRequest();
            this.advSearchService.RFQFilterRequest$.next(data);
        }
        if (this.filterType === 'po') {
            data = this.poFilterRequest();
            this.advSearchService.POFilterRequest$.next(data);
        }
        if (this.filterType === 'indent') {
            data = this.indentFilterRequest();
            this.advSearchService.indentFilterRequest$.next(data);
        }
    }

    getFilterExportRequest() {
        let data;
        if (this.filterType === 'rfq') {
            data = this.rfqFilterRequest();
            this.advSearchService.RFQFilterExportRequest$.next(data);
        }
        if (this.filterType === 'po') {
            data = this.poFilterRequest();
            this.advSearchService.POFilterExportRequest$.next(data);
        }
        if (this.filterType === 'indent') {
            data = this.indentFilterRequest();
            this.advSearchService.indentFilterExportRequest$.next(data);
        }
    }

    rfqFilterRequest() {
        let data: rfqRequestData = {};
        data.rfqStatus = [];
        data.rfqExpiryStartDate = this.expiryFromPickerEl ? this.expiryFromPickerEl : null;
        data.rfqExpiryEndDate = this.expiryToPickerEl ? this.expiryToPickerEl : null;
        data.rfqRaisedStartDate = this.raisedFromPickerEl ? this.raisedFromPickerEl : null;
        data.rfqRaisedEndDate = this.raisedToPickerEl ? this.raisedToPickerEl : null;
        if (this.isBidSubmitted) {
            data.rfqStatus.push('2');
        }
        if (this.isNotSubmitted) {
            data.rfqStatus.push('1');
        }
        data.projectIDList = this.advSearchService.getFinalList(this.selectedProjects, 'projects');
        data.materialCodeList = this.advSearchService.getFinalList(this.selectedMaterials, 'materials');
        data.supplierIDList = this.advSearchService.getFinalList(this.selectedSuppliers, 'suppliers');
        data.userIDList = this.advSearchService.getFinalList(this.selectedUsers, 'users');
        return data;
    }

    poFilterRequest() {
        let data: poRequestData = {};
        data.poRaisedStartDate = this.raisedFromPickerEl ? this.raisedFromPickerEl : null;
        data.poRaisedEndDate = this.raisedToPickerEl ? this.raisedToPickerEl : null;

        data.poStatus = [];

        if (this.po1.checked) {
            data.poStatus.push('2');
        }
        if (this.po2.checked) {
            data.poStatus.push('3');
        }
        if (this.po3.checked) {
            data.poStatus.push('1');
        }

        data.projectIdList = this.advSearchService.getFinalList(this.selectedProjects, 'projects');
        data.materialCodeList = this.advSearchService.getFinalList(this.selectedMaterials, 'materials');
        data.supplierIdList = this.advSearchService.getFinalList(this.selectedSuppliers, 'suppliers');
        data.poCreatedByList = this.advSearchService.getFinalList(this.selectedCreated, 'created');
        data.poApprovedByList = this.advSearchService.getFinalList(this.selectedApprovers, 'approvers');
        data.poAmountMin = Number(this.minAmt.value);
        data.poAmountMax = Number(this.maxAmt.value);

        return data;
    }

    indentFilterRequest() {
        let data: indentRequestData = {};
        data.indentStatus = [];
        data.projectId = 0;
        data.materialCodeList = this.advSearchService.getFinalList(this.selectedMaterials, 'materials');
        data.indentRaisedByList = this.advSearchService.getFinalList(this.selectedUsers, 'users');

        if (this.indentOpen.checked) {
            data.indentStatus.push('1');
        }
        if (this.indentClosed.checked) {
            data.indentStatus.push('2');
        }

        data.indentRaisedStartDate = this.raisedFromPickerEl ? this.raisedFromPickerEl : null;
        data.indentRaisedEndDate = this.raisedToPickerEl ? this.raisedToPickerEl : null;
        data.indentRequestStartDate = this.requestedFromPicker._datepickerInput.value ? this.advSearchService.getDateInFormat(this.requestedFromPicker._datepickerInput.value) : null;
        data.indentRequestEndDate = this.requestedToPicker._datepickerInput.value ? this.advSearchService.getDateInFormat(this.requestedToPicker._datepickerInput.value) : null;
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
            this.usersList = this.getUserWithName(this.usersData);
        }
        if (type === 'approvers') {
            this.approversSelect.options.find(opt => opt.value.ProjectUser.userId === id).deselect();
            this.approversList = this.getUserWhoCanApprove(this.usersData);
        }
        if (type === 'created') {
            this.createdSelect.options.find(opt => opt.value.ProjectUser.userId === id).deselect();
            this.createdList = this.getUserWithName(this.usersData);
        }
    }

    clearFilter() {
        this.expiryFromPickerEl = '';
        this.expiryToPickerEl = '';
        this.raisedFromPickerEl = '';
        this.raisedToPickerEl = '';

        if (this.filterType === 'rfq') {
            this.isBidSubmitted = false;
            this.isNotSubmitted = false;
            this.bidSubmitted.checked = false;
            this.notSubmitted.checked = false;
            this.expiryFromPicker._datepickerInput.value = '';
            this.expiryToPicker._datepickerInput.value = '';
        }

        if (this.filterType === 'po') {
            this.po1.checked = false;
            this.po2.checked = false;
            this.po3.checked = false;

            this.minAmt.value = '';
            this.maxAmt.value = '';

            this.approversSelect.options.forEach(opt => opt.deselect());
            this.createdSelect.options.forEach(opt => opt.deselect());
        }

        if (this.filterType === 'indent') {
            this.indentOpen.checked = false;
            this.indentClosed.checked = false;
            this.requestedFromPicker._datepickerInput.value = '';
            this.requestedToPicker._datepickerInput.value = '';
        }

        this.selectedProjects = [];
        this.selectedMaterials = [];
        this.selectedSuppliers = [];
        this.selectedUsers = [];

        if (this.filterType === 'rfq' || this.filterType === 'po') {
            this.projectsSelect.options.forEach(opt => opt.deselect());
            this.suppliersSelect.options.forEach(opt => opt.deselect());
        }
        if (this.filterType === 'rfq' || this.filterType === 'indent') {
            this.usersSelect.options.forEach(opt => opt.deselect());
        }

        this.materialsSelect.options.forEach(opt => opt.deselect());

        this.raisedFromPicker._datepickerInput.value = '';
        this.raisedToPicker._datepickerInput.value = '';
        this.accordion.closeAll();
        this.getFilterRequest();
    }

    checkFromDate(event, type) {
        if (type._datepickerInput.value) {
            let d1 = new Date(type._datepickerInput.value);
            let d2 = new Date(event.target.value);
            // event._maxDate = type._datepickerInput.value;
            if (d2.getTime() < d1.getTime()) {
                event.target.value = '';
            }
        }
    }
    checkToDate(event, type) {
        if (type._datepickerInput.value) {
            let d1 = new Date(event.target.value);
            let d2 = new Date(type._datepickerInput.value);
            // type._maxDate = event.target.value;
            if (d2.getTime() < d1.getTime()) {
                type._datepickerInput.value = '';
            }
        }
    }

    checkAmount(event, type, minMax) {
        event.currentTarget.value = event.currentTarget.value;
        if (event.currentTarget.value) {
            if (minMax === '0' && type.value) {
                if (Number(type.value) < Number(event.target.value)) {
                    type.value = event.target.value;
                }

            }
            if (minMax === '1' && type.value) {
                if (Number(type.value) > Number(event.target.value)) {
                    event.target.value = type.value;
                }
            }
        }
    }

}