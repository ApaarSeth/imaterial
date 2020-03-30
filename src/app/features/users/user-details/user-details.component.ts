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
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';
import { CommonService } from 'src/app/shared/services/commonService';

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

  public UserDashboardTour: GuidedTour = {
    tourId: 'supplier-tour',
    useOrb: false,
    steps: [
      {
        title: 'Add User',
        selector: '.add-user-button',
        content: 'Click here to add other users of your organisation.',
        orientation: Orientation.Left
      }
    ],
      skipCallback: () => {
      this.setLocalStorage()
    },
    completeCallback: () => {
      this.setLocalStorage()
    }
  };
  userId: number;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router,
    private ref: ChangeDetectorRef,
    private userService: UserService,
    private guidedTourService: GuidedTourService,
    private userGuideService : UserGuideService,
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
      if ((localStorage.getItem('user') == "null") || (localStorage.getItem('user') == '0')) {
      setTimeout(() => {
        this.guidedTourService.startTour(this.UserDashboardTour);
      }, 1000);
    }
    this.getAllUsers();
   this.getNotifications();
  }

 getNotifications(){
    this.commonService.getNotification(this.userId);
  }

  getAllUsers() {
    this.userService.getAllUsers(this.orgId).then(data => {
      if (data) {
        this.dataSourceActivate = new MatTableDataSource(data.data.activatedProjectList);
        this.dataSourceDeactivate = new MatTableDataSource(data.data.deactivatedProjectList);

        this.dataSourceActivateTemp = data.data.activatedProjectList;
        this.dataSourceDeactivateTemp = data.data.deactivatedProjectList;

        this.dataSourceActivate.filterPredicate = (data, filterValue) => {
          const username = data.ProjectUser.firstName.toLowerCase() + " " + data.ProjectUser.lastName.toLowerCase();
          const dataStr = username + data.ProjectUser.email.toLowerCase() + data.ProjectUser.contactNo + data.ProjectUser.roleId + data.roleName + data.ProjectList;
          return dataStr.indexOf(filterValue) != -1;
        }

        this.dataSourceDeactivate.filterPredicate = (data, filterValue) => {
           const username = data.ProjectUser.firstName.toLowerCase() + " " + data.ProjectUser.lastName.toLowerCase();

          const dataStr = username + data.ProjectUser.email.toLowerCase() + data.ProjectUser.contactNo + data.ProjectUser.roleId + data.roleName + data.ProjectList;
          return dataStr.indexOf(filterValue) != -1;
        }
        if (this.dataSourceActivateTemp.length > 0 && this.dataSourceDeactivateTemp.length > 0) {
          this.addUserBtn = true;
        }
        else {
          this.addUserBtn = false;
        }
      }

    });
  }

    setLocalStorage() {
        const popovers ={
        "userId":this.userId,
        "moduleName":"user",
        "enableGuide":1
    };
        this.userGuideService.sendUserGuideFlag(popovers).then(res=>{
          if(res){
            localStorage.setItem('user', '1');
          }
        })
  }
  addUser() {
    this.openDialog({
      isEdit: false,
      isDelete: false,

    } as UserDetailsPopUpData);
  }
  openDialog(data: UserDetailsPopUpData): void {

    const dialogRef = this.dialog.open(AddEditUserComponent, {
      width: "660px",
      data
    });

    dialogRef.afterClosed().toPromise().then(data => {
      if (data && data != null) {
        this.getAllUsers();
      }
    });

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

    const dialogRef = this.dialog.open(DeactiveUserComponent, {
      width: "500px",
      data
    });
    dialogRef.afterClosed().toPromise().then(data => {
      if (data && data != null) {
        this.getAllUsers();
      }
    });

  }

  editProject(data) {
    const projectList: Array<number> = new Array<number>();
    this.userDetailsTemp.firstName = data.ProjectUser.firstName;
    this.userDetailsTemp.lastName = data.ProjectUser.lastName;
    this.userDetailsTemp.email = data.ProjectUser.email;
    this.userDetailsTemp.contactNo = data.ProjectUser.contactNo;
    this.userDetailsTemp.roleId = data.ProjectUser.roleId;
    this.userDetailsTemp.userId = data.ProjectUser.userId;
    this.userDetailsTemp.accountStatus = data.ProjectUser.accountStatus;
    
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