import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AddProjectComponent } from "../../shared/dialogs/add-project/add-project.component";
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { PurchaseOrderData } from 'src/app/shared/models/po-details/po-details-list';
import { ProjectService } from 'src/app/shared/services/projectDashboard/project.service';
import { SelectProjectComponent } from 'src/app/shared/dialogs/select-project/select-project.component';
import { ProjectDetails } from 'src/app/shared/models/project-details';

@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html'
})
export class AppDashboardComponent implements OnInit {

  orgId: number;
  poData: PurchaseOrderData;
  userId: number;
  projectCount: number;
  projectLists: ProjectDetails[];

  constructor(public dialog: MatDialog,
    private router: Router,
    private _userService: UserService,
    private _projectService: ProjectService) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.getDashboardInfo();
    this.getProjectsNumber();
  }

  openProject() {
    let data = {
      isEdit: false,
      isDelete: false
    };
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: "1000px",
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/dashboard']);
    });
  }

  getDashboardInfo(){
    const data = {
      "orgId": 21,
      "startDate":"2020-01-01T18:30:00.000Z",
      "endDate":"2020-09-28T18:30:00.000Z",
      "dataSource":"po"
    }

    this._userService.getDashboardData(data).then(res => {
        this.poData = res.data;
    })
  }

  getProjectsNumber(){
    this._projectService.getProjects(this.orgId, this.userId).then(res => {
      this.projectCount = res.data ? res.data.length : 0;
      this.projectLists = res.data;
    });
  }

  openBomDialog(){
    const dialogRef = this.dialog.open(SelectProjectComponent, {
      width: "1000px",
      data: this.projectLists
    });

    dialogRef.afterClosed().subscribe(result => {
        return;
    });
  }
}