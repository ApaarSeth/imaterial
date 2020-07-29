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
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { CountryCode } from 'src/app/shared/models/currency';
import { AppNotificationService } from 'src/app/shared/services/app-notification.service';

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["../../../assets/scss/main.scss"]
})
export class DashboardComponent implements OnInit {
  tourId: string;
  useOrb?: boolean;
  steps: import("ngx-guided-tour").TourStep[];
  minimumScreenSize?: number;
  resizeDialog?: { title?: string; content: string; };
  preventBackdropFromAdvancing?: boolean;
  searchText: string = null;

  allProjects: ProjectDetails[] = [];
  orgId: Number;
  userId: Number;
  permissionObj: any;
  countryList: CountryCode[] = [];

  isMobile: boolean;

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
        selector: '.example-form-field.border-input',
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
    ],
    skipCallback: () => {
      this.setLocalStorage()
    },
    completeCallback: () => {
      this.setLocalStorage()
    }
  };

  constructor(
    private projectService: ProjectService,
    private userGuideService: UserGuideService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private guidedTourService: GuidedTourService,
    private commonService: CommonService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private notifier: AppNotificationService
  ) {
  }

  ngOnInit() {
    const role = localStorage.getItem("role")
    this.permissionObj = this.permissionService.checkPermission(role);
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.isMobile = this.commonService.isMobile().matches;
    this.getAllProjects();
    this.countryList = this.route.snapshot.data.countryList;

  }

  setLocalStorage() {
    const popovers = {
      "userId": this.userId,
      "moduleName": "projectDashboard",
      "enableGuide": 1
    };
    this.userGuideService.sendUserGuideFlag(popovers).then(res => {
      if (res) {
        localStorage.setItem('projectDashboard', '1');
      }
    })

    this.getNotifications();
  }

  getNotifications() {
    this.commonService.getNotification(this.userId);
  }
  getAllProjects() {
    this.projectService.getProjects(this.orgId, this.userId).then(data => {
      this.allProjects = data.data;
      if (this.allProjects && this.allProjects.length > 0) {
        if ((localStorage.getItem('projectDashboard') == "null") || (localStorage.getItem('projectDashboard') == '0')) {
          setTimeout(() => {
            this.guidedTourService.startTour(this.dashboardTour)

          }, 1000);
        }
      }
      this.route.queryParams.subscribe(params => {
        if (params.projectId) {
          this.editProject(Number(params.projectId))
        }
      })
    });
  }

  editProject(projectId: number) {
    const data: ProjetPopupData = {
      isEdit: true,
      isDelete: false,
      detail: this.allProjects.find(pro => pro.projectId === projectId),
      countryList: this.countryList
    };

    this.openDialog(data);
  }

  addProject() {
    this.openDialog({
      isEdit: false,
      isDelete: false,
      countryList: this.countryList
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
          if (result && result != null) {
            this.projectService
              .getProjects(this.orgId, this.userId)
              .then(data => {
                this.allProjects = data.data;
                this.notifier.snack(result)
              })
          };
        })
    } else if (data.isDelete == true) {
      const dialogRef = this.dialog.open(DoubleConfirmationComponent, {
        width: "500px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => {
          if (result && result != null) {
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