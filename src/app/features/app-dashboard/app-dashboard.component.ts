import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AddProjectComponent } from "../../shared/dialogs/add-project/add-project.component";
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';

@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html'
})
export class AppDashboardComponent implements OnInit {

  orgId: number;

  constructor(public dialog: MatDialog,
    private router: Router,
    private _userService: UserService) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.getDashboardInfo();
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
      "orgId":21,
      "startDate":"2020-01-01T18:30:00.000Z",
      "endDate":"2020-09-28T18:30:00.000Z",
      "dataSource":"po"
    }

    this._userService.getDashboardData(data).then(res => {
      console.log(res);
      debugger
    })

  }
}