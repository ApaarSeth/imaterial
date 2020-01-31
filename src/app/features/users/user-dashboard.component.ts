import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import {
  ProjectDetails,
  ProjetPopupData
} from "src/app/shared/models/project-details";
import { DoubleConfirmationComponent } from "src/app/shared/dialogs/double-confirmation/double-confirmation.component";
import { AddProjectComponent } from "src/app/shared/dialogs/add-project/add-project.component";
import { MatDialog } from "@angular/material";
import { IndentVO } from "src/app/shared/models/indent";
import { IndentService } from "src/app/shared/services/indent/indent.service";
import { Subcategory } from "src/app/shared/models/subcategory-materials";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { AddEditUserComponent } from 'src/app/shared/dialogs/add-edit-user/add-edit-user.component';
import { UserDetailsPopUpData } from 'src/app/shared/models/user-details';


@Component({
  selector: "user-dashboard",
  templateUrl: "./user-dashboard.component.html",
  styleUrls: ["../../../assets/scss/main.scss"]
})
export class UserDashboardComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
  }
    addProject() {
    this.openDialog({
      isEdit: false,
      isDelete: false
    } as UserDetailsPopUpData);
  }
   openDialog(data: UserDetailsPopUpData): void {
    if (data.isDelete == false) {
      const dialogRef = this.dialog.open(AddEditUserComponent, {
        width: "700px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => {
          // to do
          // this.projectService.getProjects(1, 1).then(data => {
          //   this.allProjects = data.data;
          // });
        });
    } else if (data.isDelete == true) {
      const dialogRef = this.dialog.open(DoubleConfirmationComponent, {
        width: "500px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => {
          // this.projectService.getProjects(1, 1).then(data => {
          //   this.allProjects = data.data;
          // });
        });
    }
  }
}


