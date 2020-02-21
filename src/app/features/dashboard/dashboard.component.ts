import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { ProjectService } from "../../shared/services/projectDashboard/project.service";
import { MatDialog } from "@angular/material";
import { AddProjectComponent } from "src/app/shared/dialogs/add-project/add-project.component";
import { ActivatedRoute } from "@angular/router";
import {
  ProjectDetails,
  ProjetPopupData
} from "src/app/shared/models/project-details";
import { DoubleConfirmationComponent } from "src/app/shared/dialogs/double-confirmation/double-confirmation.component";

// export interface DialogData {
//   animal: string;
//   name: string;
// }
@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["../../../assets/scss/main.scss"]
})
export class DashboardComponent implements OnInit {
  searchText: string = null;

  allProjects: ProjectDetails[];
  orgId: Number;
  userId: Number;
  constructor(
    private projectService: ProjectService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    console.log(this.userId);
    // this.allProjects = this.activatedRoute.snapshot.data.dashBoardData;
    this.getAllProjects();
  }


  getAllProjects() {
    this.projectService.getProjects(this.orgId, this.userId).then(data => {
      this.allProjects = data.data;
    });
  }

  editProject(projectId: number) {
    const data: ProjetPopupData = {
      isEdit: true,
      isDelete: false,
      detail: this.allProjects.find(pro => pro.projectId === projectId)
    };

    this.openDialog(data);
  }

  addProject() {
    this.openDialog({
      isEdit: false,
      isDelete: false
    } as ProjetPopupData);
    // this.getAllProjects();
  }

  deleteProject(projectId: number) {
    const data: ProjetPopupData = {
      isEdit: false,
      isDelete: true,
      detail: this.allProjects.find(pro => pro.projectId === projectId)
    };

    this.openDialog(data);
  }

  // modal function
  openDialog(data: ProjetPopupData): void {
    if (data.isDelete == false) {
      const dialogRef = this.dialog.open(AddProjectComponent, {
        width: "1000px",
        data
      });

      dialogRef.afterClosed().toPromise().then(result => {
        
        if(result){
          this.projectService.getProjects(this.orgId, this.userId).then(data => {
              this.allProjects = data.data;
          });
        }

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
          this.projectService
            .getProjects(this.orgId, this.userId)
            .then(data => {
              this.allProjects = data.data;
            });
        });
    }
  }
}