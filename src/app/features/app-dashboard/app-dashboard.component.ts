import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AddProjectComponent } from "../../shared/dialogs/add-project/add-project.component";
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { PurchaseOrderData } from 'src/app/shared/models/po-details/po-details-list';
import { ProjectService } from 'src/app/shared/services/projectDashboard/project.service';
import { SelectProjectComponent } from 'src/app/shared/dialogs/select-project/select-project.component';
import { ProjectDetails } from 'src/app/shared/models/project-details';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';
import { GuideTourModel } from 'src/app/shared/models/guided_tour';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { ViewVideoComponent } from 'src/app/shared/dialogs/video-video/view-video.component';
import { permission } from 'src/app/shared/models/permissionObject';
import { ReleaseNoteComponent } from 'src/app/shared/dialogs/release-notes/release-notes.component';
@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html'
})
export class AppDashboardComponent implements OnInit {

  orgId: number;
  poData: PurchaseOrderData;
  rfqData: PurchaseOrderData;
  indentData: PurchaseOrderData;
  userId: number;
  projectCount: number;
  projectLists: ProjectDetails[];
  label: string;
  userGuidedata: GuideTourModel[] = [];
  permissionObj: permission;
  tab1: string;
  tab2: string;
  constructor(public dialog: MatDialog,
    private router: Router,
    private _userService: UserService,
    private userguideservice: UserGuideService,
    private _projectService: ProjectService,
    private commonService: CommonService,
    private permissionService: PermissionService) { }

  ngOnInit() {
    const role = localStorage.getItem("role")
    if (role) {
      this.permissionObj = this.permissionService.checkPermission(role);
      this.orgId = Number(localStorage.getItem("orgId"));
    }
    this.userId = Number(localStorage.getItem("userId"));
     
    this.getDashboardInfo('po');
    this.getDashboardInfo('rfq');
    this.getDashboardInfo('indent');

    window.dispatchEvent(new Event('resize'));

  if(localStorage.getItem('ReleaseNotes') == '0') {
   this.userguideservice.userGetReleaseNote().then(res => {
      if(res.data != null && res.data != []){
        this.openReleaseNote(res.data.releasText,res.data.releaseNoteId);
      }
        if(res.data == null || res.data == []){
        localStorage.setItem('ReleaseNotes','1');
        }
    });
 }
    
    
    this.userguideservice.getUserGuideFlag().then(res => {
      this.userGuidedata = res.data;
      this.userGuidedata.forEach(element => {
        localStorage.setItem(element.moduleName, element.enableGuide);
      });

    })

    this.getProjectsNumber();
    this.getNotifications();
  }

  getNotifications() {
    this.commonService.getNotification(this.userId);
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
      if (result && result != null)
        this.router.navigate(['/project-dashboard']);
    });
  }

 openReleaseNote(data,releaseNoteId) {
 
    const dialogRef = this.dialog.open(ReleaseNoteComponent,  { disableClose: true ,
     width: "500px", data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result == 'closed')
         {
           // post api hit
           console.log(result + " " +releaseNoteId);
              localStorage.setItem('ReleaseNotes','1') ;
         }
    });
  }
  getDashboardInfo(label) {
    const data = {
      "orgId": this.orgId,
      "startDate": "2020-01-01T18:30:00.000Z",
      "endDate": "2020-09-28T18:30:00.000Z",
      "dataSource": label
    }

    this._userService.getDashboardData(data).then(res => {
      if (label == 'po')
        this.poData = res.data;

      if (label == 'rfq')
        this.rfqData = res.data;

      if (label == 'indent')
        this.indentData = res.data;
    })
  }

  onTabChanged($event) {
    let clickedIndex = $event.index;
    switch (clickedIndex) {
      case 0: {
        this.label = 'po';
        break;
      }
      case 1: {
        this.label = 'rfq';
        break;
      }
      case 2: {
        this.label = 'indent';
        break;
      }
      default: {
        return;
      }
    }
    this.getDashboardInfo(this.label);
  }

  getProjectsNumber() {
    this._projectService.getProjects(this.orgId, this.userId).then(res => {
      this.projectCount = res.data ? res.data.length : 0;
      this.projectLists = res.data;
    });
  }

  openBomDialog() {
    const dialogRef = this.dialog.open(SelectProjectComponent, {
      width: "1000px",
      data: this.projectLists
    });

    dialogRef.afterClosed().subscribe(result => {
      return;
    });
  }

  showVideo(): void {

    const dialogRef = this.dialog.open(ViewVideoComponent, {
      width: "660px"
    });

  }
  // onResize(event) {
  //  if(event.target.innerWidth <= 494){
  //    this.tab1 = "P.O.";
  //    this.tab2 = "RFQ for Quotations";
  //  }else{
  //    this.tab1 = "Purchase Orders";
  //    this.tab2 = "Request for Quotations";
  //  }
  // }
 
  @HostListener('window:resize', ['$event'])
      sizeChange(event) {
       if(event.currentTarget.innerWidth <= 494){
          this.tab1 = "P.O.";
          this.tab2 = "RFQ";
        }else{
          this.tab1 = "Purchase Orders";
          this.tab2 = "Request for Quotations";
        }
    }
}