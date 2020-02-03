import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatChipInputEvent } from "@angular/material";
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
import { UserDetailsPopUpData,AllUserDetails,UserAdd } from 'src/app/shared/models/user-details';
import { DeactiveUserComponent } from 'src/app/shared/dialogs/disable-user/disable-user.component';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { forEachChild } from 'typescript';

// chip static data
export interface Fruit {
  name: string;
}


const ELEMENT_DATA: AllUserDetails[] =[];

@Component({
  selector: "user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})


export class UserDetailComponent implements OnInit {
   displayedColumns: string[] = ['username', 'email', 'contactNo', 'roleName', 'ProjectList','star'];
  displayedColumnsDeactivate : string[] = ['username', 'email', 'contactNo', 'roleName', 'ProjectList'];
   dataSource = ELEMENT_DATA;
   dataSourceActivate = ELEMENT_DATA;
   dataSourceDeactivate = ELEMENT_DATA;
   userDetailsTemp :UserAdd = {};
   deactivateUsers: Array<UserAdd> = new Array<UserAdd>();
   activateUsers: Array<UserAdd> = new Array<UserAdd>();

   addUserBtn : boolean = false;
  allUsers: AllUserDetails;
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router,
    private ref: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit() { 
    this.getAllUsers();
  }

  getAllUsers(){
  this.userService.getAllUsers(1).then(data => {
            this.dataSource = data.data;
            if(this.dataSource.length>0){
              this.addUserBtn = false;
            } 
            else{
              this.addUserBtn = true;
            }

            this.dataSource.forEach(activateusers => {
                 if(activateusers.ProjectUser.status == 0){
                  this.activateUsers.push(activateusers);
                }
                else if(activateusers.ProjectUser.status == 1){
                  this.deactivateUsers.push(activateusers);
                }
            });

            this.dataSourceActivate = this.activateUsers;
            this.dataSourceDeactivate = this.deactivateUsers;
                if (!this.ref['destroyed']) {
                    this.ref.detectChanges();
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
        width: "800px",
        data
      });
      
      dialogRef.afterClosed().toPromise().then(data => {
         this.getAllUsers();
        console.log("The dialog was closed");

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
        width: "800px",
        data
      });
      dialogRef.afterClosed().toPromise().then(data => {
         this.getAllUsers();
        console.log("The dialog was closed");
      });
    }
  }


  editProject(data) {
    const projectList : Array<number> = new Array<number>(); 
    this.userDetailsTemp.firstName = data.ProjectUser.firstName;
    this.userDetailsTemp.lastName = data.ProjectUser.lastName;
    this.userDetailsTemp.email = data.ProjectUser.email;
    this.userDetailsTemp.contactNo = data.ProjectUser.contactNo;
    this.userDetailsTemp.roleId = data.ProjectUser.roleId;
    this.userDetailsTemp.userId = data.ProjectUser.userId;
    data.ProjectList.forEach(element => {
      projectList.push(element.projectId);
    });
    this.userDetailsTemp.projects = projectList;
    
    this.openDialog({
      isEdit: true,
      isDelete: false,
      detail: this.userDetailsTemp
    } as UserDetailsPopUpData);
  }

}
