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
import { GuidedTourService, OrientationConfiguration, Orientation, GuidedTour } from 'ngx-guided-tour';

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

  allProjects: ProjectDetails[] = [];
  orgId: Number;
  userId: Number;

   public dashboardTour: GuidedTour = {
        tourId: 'purchases-tour',
        useOrb: false,
        
        steps: [
            {
                title: 'Add Project',
                selector: '.demo-title',
                content: 'Click here to add a new project with basic details of project.',
                orientation: Orientation.Left
                
            },
            {
                title: 'Search Project',
                selector:'.example-form-field.border-input',
                content: 'Click here to search your project from project list.',
                 orientation: Orientation.Right
            },
            {
                title: 'View Project',
                selector: '.view-project',
                content: 'Click here to view the project & add materials in project.',
                orientation: Orientation.Left
            },
            {
                title: 'Edit Project',
                selector: '.edit-project',
                content: 'Click here to edit the project details.',
                orientation: Orientation.Left
            },
            {
                title: 'Delete Project',
                selector: '.delete-project',
                content: 'Click here to delete the project. All your project data will get deleted.',
                orientation: Orientation.Left
            },
            {
                title: 'Show All Materials',
                selector: '.showAllMaterials',
                content: 'Click here to view all your materials.',
                orientation: Orientation.Bottom
            },
            {
                title: 'Show Open Indents',
                selector: '.showOpenIndents',
                content: 'Click here to view all your indents.',
                orientation: Orientation.Bottom
            },
            {
                title: 'Show Purchase Orders',
                selector: '.showPurchaseOrders',
                content: 'Click here to view all your purchase orders.',
                orientation: Orientation.Bottom
            }
           
        ]
    };
    
  constructor(
    private projectService: ProjectService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private guidedTourService: GuidedTourService
  ) {
     setTimeout(() => {
            this.guidedTourService.startTour(this.dashboardTour);
        }, 1000);
  }

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

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => {
            if(result && result!=null){
               this.projectService
              .getProjects(this.orgId, this.userId)
              .then(data => {
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
           if(result && result!=null){
               this.projectService
                .getProjects(this.orgId, this.userId)
                .then(data => {
                  this.allProjects = data.data;
                });
           }
      
        });
    }
  }
}
