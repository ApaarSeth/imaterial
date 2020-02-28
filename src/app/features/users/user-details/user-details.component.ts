import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatChipInputEvent, MatTableDataSource } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ProjectDetails,
  ProjectIds
} from "src/app/shared/models/project-details";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { stringify } from "querystring";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  RfqMat,
  RfqMaterialResponse
} from "src/app/shared/models/RFQ/rfq-details";
import { AddAddressDialogComponent } from "src/app/shared/dialogs/add-address/address-dialog.component";
import { AddEditUserComponent } from 'src/app/shared/dialogs/add-edit-user/add-edit-user.component';
import { UserDetailsPopUpData, AllUserDetails, UserAdd } from 'src/app/shared/models/user-details';
import { DeactiveUserComponent } from 'src/app/shared/dialogs/disable-user/disable-user.component';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { forEachChild } from 'typescript';

// chip static data
export interface Fruit {
  name: string;
}


const ELEMENT_DATA: AllUserDetails[] = [];

@Component({
  selector: "user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})


export class UserDetailComponent implements OnInit {
  displayedColumns: string[] = ['User Name', 'Email Id', 'Phone', 'Role', 'Project', 'star'];
  displayedColumnsDeactivate: string[] = ['User Name', 'Email Id', 'Phone', 'Role', 'Project'];

  dataSourceActivateTemp = ELEMENT_DATA;
  dataSourceDeactivateTemp = ELEMENT_DATA;

  dataSourceActivate: MatTableDataSource<AllUserDetails>;
  dataSourceDeactivate: MatTableDataSource<AllUserDetails>;
  userDetailsTemp: UserAdd = {};
  deactivateUsers: Array<UserAdd> = new Array<UserAdd>();
  activateUsers: Array<UserAdd> = new Array<UserAdd>();

  addUserBtn: boolean = false;
  allUsers: AllUserDetails;
  orgId: number;
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router,
    private ref: ChangeDetectorRef,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers(this.orgId).then(data => {

      this.dataSourceActivate = new MatTableDataSource(data.data.activatedProjectList);
      this.dataSourceDeactivate = new MatTableDataSource(data.data.deactivatedProjectList);

      this.dataSourceActivateTemp = data.data.activatedProjectList;
      this.dataSourceDeactivateTemp = data.data.deactivatedProjectList;

      this.dataSourceActivate.filterPredicate = (data, filterValue) => {
        const dataStr = data.ProjectUser.firstName + data.ProjectUser.lastName + data.ProjectUser.email + data.ProjectUser.contactNo + data.ProjectUser.roleId + data.roleName + data.ProjectList;
        return dataStr.indexOf(filterValue) != -1;
      }

      this.dataSourceDeactivate.filterPredicate = (data, filterValue) => {
        const dataStr = data.ProjectUser.firstName + data.ProjectUser.lastName + data.ProjectUser.email + data.ProjectUser.contactNo + data.ProjectUser.roleId + data.roleName + data.ProjectList;
        return dataStr.indexOf(filterValue) != -1;
      }

      if (this.dataSourceActivateTemp.length > 0 && this.dataSourceDeactivateTemp.length > 0) {
        this.addUserBtn = true;
      }
      else {
        this.addUserBtn = false;
      }

    });
  }

  addUser() {
    this.openDialog({
      isEdit: false,
      isDelete: false
    } as UserDetailsPopUpData);
  }

  openDialog(data: UserDetailsPopUpData): void {
    if (AddAddressDialogComponent) {
      const dialogRef = this.dialog.open(AddEditUserComponent, {
        width: "660px",
        data
      });

      dialogRef.afterClosed().toPromise().then(data => {
        if(data === undefined){
          this.getAllUsers();
        }
      });
    }
  }


  deactivateUser(data) {
    this.userDetailsTemp.userId = data.ProjectUser.userId;
    this.openDialogDeactiveUser({
      isEdit: false,
      isDelete: true,
      detail: this.userDetailsTemp
    } as UserDetailsPopUpData);
  }

  openDialogDeactiveUser(data: UserDetailsPopUpData): void {
    if (AddAddressDialogComponent) {
      const dialogRef = this.dialog.open(DeactiveUserComponent, {
        width: "500px",
        data
      });
      dialogRef.afterClosed().toPromise().then(data => {
        if(data === undefined){
          this.getAllUsers();
        }
      });
    }
  }

  editProject(data) {
    const projectList: Array<number> = new Array<number>();
    this.userDetailsTemp.firstName = data.ProjectUser.firstName;
    this.userDetailsTemp.lastName = data.ProjectUser.lastName;
    this.userDetailsTemp.email = data.ProjectUser.email;
    this.userDetailsTemp.contactNo = data.ProjectUser.contactNo;
    this.userDetailsTemp.roleId = data.ProjectUser.roleId;
    this.userDetailsTemp.userId = data.ProjectUser.userId;
    data.ProjectList.forEach(element => {
      projectList.push(element.projectId);
    });
    this.userDetailsTemp.projectIds = projectList;

    this.openDialog({
      isEdit: true,
      isDelete: false,
      detail: this.userDetailsTemp
    } as UserDetailsPopUpData);
  }

  applyFilteqqr(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  applyFilter(filterValue: string) {
    this.dataSourceActivate.filter = filterValue.trim().toLowerCase();
    this.dataSourceDeactivate.filter = filterValue.trim().toLowerCase();
  }
}