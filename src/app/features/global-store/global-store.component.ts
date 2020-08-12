import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from "@angular/router";
import { GlobalStoreService } from 'src/app/shared/services/global-store/global-store.service';
import { GlobalProject } from 'src/app/shared/models/GlobalStore/projectWise';
import { CommonService } from 'src/app/shared/services/commonService';
import { MatDialog } from '@angular/material';
import { SelectProjectComponent } from 'src/app/shared/dialogs/select-project/select-project.component';
import { ProjectService } from 'src/app/shared/services/projectDashboard/project.service';

@Component({
  selector: "app-global-store",
  templateUrl: "./global-store.component.html",
  styleUrls: ["../../../assets/scss/main.scss"]
})
export class GlobalStoreComponent implements OnInit {

  buttonName: string = "materialWise";
  globalStoreData: [];
  projectWiseData: GlobalProject[] = [];
  materialDataLength: number;
  projectDataLength: number;
  userId: number;
  sidebarNav: boolean;
  isMobile: boolean;
  orgId: Number;
  projectList
  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private router: Router,
    private globalStoreService: GlobalStoreService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.userId = Number(localStorage.getItem("userId"));
    this.orgId = Number(localStorage.getItem("orgId"))
    this.route.data.subscribe(data => {
      this.globalStoreData = data.globalData.data;
    });
    this.getNotifications();
    Promise.all([this.projectService.getProjects(this.orgId, this.userId),
    this.projectService.getProjects(this.orgId, this.userId), this.getNotifications]).then(res => {
      this.projectList = res[0].data
    })

  }

  ngOnChanges() {
    this.sidebarNav = Boolean(localStorage.getItem("sidebarNavigation"));
  }

  getNotifications() {
    this.commonService.getNotification(this.userId);
  }
  setButtonName(name: string) {

    this.buttonName = name;

    if (this.buttonName === 'projectWise') {

      const orgId = Number(localStorage.getItem("orgId"));

      this.globalStoreService.getProjectWiseData(orgId).then(res => {
        this.projectWiseData = res.data;
      })

    }
  }

  createRfq() {
    this.router.navigate(['/rfq/createRfq']);
  }

  createPo() {
    this.router.navigate(['/po/initiate-po']);
  }

  materialShowDataLength(event) {
    this.materialDataLength = event;
    this.cdr.detectChanges();
  }
  projectShowDataLength(event) {
    this.projectDataLength = event;
    this.cdr.detectChanges();
  }

  openBomDialog() {
    const dialogRef = this.dialog.open(SelectProjectComponent, {
      width: "600px",
      data: this.projectList
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   this.getProjectsNumber();
    //   return;
    // });
  }
}