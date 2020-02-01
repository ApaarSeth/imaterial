import { Component, OnInit, Inject, ViewChild } from "@angular/core";
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
import { UserDetailsPopUpData,AllUserDetails } from 'src/app/shared/models/user-details';
import { DeactiveUserComponent } from 'src/app/shared/dialogs/disable-user/disable-user.component';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';

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

   dataSource = ELEMENT_DATA;
  allUsers: AllUserDetails;
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {

 
  this.userService.getAllUsers(1).then(data => {
            this.dataSource = data.data;
          });


  }
  addProject() {
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
      dialogRef.afterClosed().subscribe(result => {
        console.log("The dialog was closed");
      });
    }
  }

  
   openDialogDeactiveUser(): void {
    if (AddAddressDialogComponent) {
      const dialogRef = this.dialog.open(DeactiveUserComponent, {
        width: "800px"
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("The dialog was closed");
      });
    }
  }

}
