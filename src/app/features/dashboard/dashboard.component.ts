import { AddProjectService } from './../../shared/services/add-project.service';
import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { ProjectService } from "../../shared/services/project.service";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ProjectDetails, ProjetPopupData } from "../../shared/models/project-details";
import { CountryCode } from "../../shared/models/currency";
import { GuidedTour, Orientation, GuidedTourService } from "ngx-guided-tour";
import { UserGuideService } from "../../shared/services/user-guide.service";
import { CommonService } from "../../shared/services/commonService";
import { PermissionService } from "../../shared/services/permission.service";
import { AppNotificationService } from "../../shared/services/app-notification.service";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html"
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
  openAddProject: string;

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
        title: 'Show Open PRs',
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
    private guidedTourService: GuidedTourService,
    private commonService: CommonService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
    private notifier: AppNotificationService,
    private addProjectService: AddProjectService,
    private activeRoute: ActivatedRoute
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
    this.addProjectService.onEditOrDelete.subscribe(res => {
      this.projectDeleteOrEdit(res)
    })
    this.openAddProject = this.activeRoute.snapshot.queryParams[ "openAddProject" ];
    if (this.openAddProject && this.openAddProject === '1') {
      this.addProject();
    }
  }

  projectDeleteOrEdit(event) {
    if (event) {
      this.projectService
        .getProjects(this.orgId, this.userId)
        .then(data => {
          this.allProjects = data.data;
          this.notifier.snack(event)
        })
    }
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
      // this.route.queryParams.subscribe(params => {
      //   if (params.projectId) {
      //     this.editProject(Number(params.projectId))
      //   }
      // })
    });
  }
  addProject() {
    this.addProjectService.openDialog({
      isEdit: false,
      isDelete: false,
      countryList: this.countryList
    } as ProjetPopupData);
  }


}