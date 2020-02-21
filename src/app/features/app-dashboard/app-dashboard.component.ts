import { Component, OnInit } from '@angular/core';
import { ProjetPopupData } from "../../shared/models/project-details";
import { MatDialog } from "@angular/material";
import { AddProjectComponent } from "../../shared/dialogs/add-project/add-project.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html'
})
export class AppDashboardComponent implements OnInit {

  orgId: number;

  constructor(public dialog: MatDialog,
  private router: Router) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
  }

  openProject(){
    let data={
        isEdit:false,
        isDelete:false
      };
    const dialogRef=this.dialog.open(AddProjectComponent,{
      width:"1000px",
      data
    });

    dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/dashboard']);
    });
  }
}
