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
  userId: 1;
  searchText: string = null;

  allProjects: ProjectDetails[];

  constructor(
    private projectService: ProjectService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    //const users: UserData[] = [];
    // var users1=[];
    // for (let i = 1; i <= 100; i++) { /*users.push(createNewUser(i));*/
    //   users1.push({"cnt" : i,"name":"batr"+i});
    //  }
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users1);
  }

  ngOnInit() {
    this.allProjects = this.activatedRoute.snapshot.data.dashBoardData;
  }

  //displayedColumns = ['id', 'name', 'progress', 'color'];
  //dataSource: MatTableDataSource<UserData>;

  // addProjects(projectData: ProjectDetails){
  //   this.projectService.addProjects(1,1,projectData).then(res => {
  //     res.data;
  // });
  // }

  editProject(projectId: number) {
    console.log(projectId);

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
        width: "700px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => {
          // to do
          this.projectService.getProjects(1, 1).then(data => {
            this.allProjects = data.data;
          });
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
          this.projectService.getProjects(1, 1).then(data => {
            this.allProjects = data.data;
          });
        });
    }
  }
}
