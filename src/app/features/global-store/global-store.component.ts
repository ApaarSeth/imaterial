import { AppNavigationService } from './../../shared/services/navigation.service';
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ProjectService } from "../../shared/services/project.service";
import { CommonService } from "../../shared/services/commonService";
import { SelectProjectComponent } from "../../shared/dialogs/select-project/select-project.component";
import { GlobalStoreService } from "../../shared/services/global-store.service";
import { ProjectwiseObj } from 'src/app/shared/models/GlobalStore/projectWise';

@Component({
  selector: "app-global-store",
  templateUrl: "./global-store.component.html"
})

export class GlobalStoreComponent implements OnInit {

  buttonName: string = "materialWise";
  globalStoreData: [];
  projectWiseData: ProjectwiseObj[] = [];
  materialDataLength: number;
  projectDataLength: number;
  userId: number;
  sidebarNav: boolean;
  isMobile: boolean;
  orgId: Number;
  projectList: any;
  materialPageNumber: number;
  materialPageLimit: number;
  materialTotalPageCount: number;
  projectPageNumber: number;
  projectPageLimit: number;
  projectTotalPageCount: number;

  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private router: Router,
    private globalStoreService: GlobalStoreService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private navService: AppNavigationService
  ) { }

  ngOnInit() {
    this.navService.gaEvent({
      action: 'submit',
      category: 'navService',
      label: null,
      value: null
    });
    this.isMobile = this.commonService.isMobile().matches;
    this.userId = Number(localStorage.getItem("userId"));
    this.orgId = Number(localStorage.getItem("orgId"));

    this.route.data.subscribe(data => {
      const allData = data.globalData.data;
      this.materialPageNumber = allData.pageNo;
      this.materialTotalPageCount = allData.totalCount;
      this.materialPageLimit = allData.offset;
      this.globalStoreData = allData.globalStoreMaterialObj;
    });

    this.getNotifications();

    Promise.all([this.projectService.getProjects(this.orgId, this.userId),
    this.projectService.getProjects(this.orgId, this.userId), this.getNotifications]).then(res => {
      this.projectList = res[0].data
    })
  }

  getMaterialwiseData() {
    this.globalStoreService.getMaterialWiseData(this.materialPageNumber, this.materialPageLimit).then(res => {
      if (res.data) {
        const allData = res.data;
        this.materialPageNumber = allData.pageNo;
        this.materialTotalPageCount = allData.totalCount;
        this.materialPageLimit = allData.offset;
        this.globalStoreData = allData.globalStoreMaterialObj;
      }
    });
  }

  getProjectwiseData() {
    this.globalStoreService.getProjectWiseData(this.projectPageNumber, this.projectPageLimit).then(res => {
      if (res.data) {
        const allData = res.data;
        this.projectPageNumber = allData.pageNo;
        this.projectTotalPageCount = allData.totalCount;
        this.projectPageLimit = allData.offset;
        this.projectWiseData = allData.globalStoreProjectObj;
      }
    });
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
      this.projectPageNumber = 1;
      this.projectPageLimit = 25;
      this.getProjectwiseData();
    }

    if (this.buttonName === 'materialWise') {
      this.materialPageNumber = 1;
      this.materialPageLimit = 25;
      this.getMaterialwiseData();
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
      data: this.projectList,
      panelClass: ['common-modal-style', 'select-projects-dialog']
    });
  }

  getMaterialPaginationInfo(data) {
    this.materialPageNumber = data.pageNumber;
    this.materialPageLimit = data.limit;
    this.materialTotalPageCount = data.totalCount;
    this.getMaterialwiseData();
  }

  getProjectPaginationInfo(data) {
    this.projectPageNumber = data.pageNumber;
    this.projectPageLimit = data.limit;
    this.projectTotalPageCount = data.totalCount;
    this.getProjectwiseData();
  }
}