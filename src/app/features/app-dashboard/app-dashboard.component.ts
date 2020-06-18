import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material";
import { AddProjectComponent } from "../../shared/dialogs/add-project/add-project.component";
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { PurchaseOrderData } from 'src/app/shared/models/po-details/po-details-list';
import { Range } from 'src/app/shared/models/datePicker';
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
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxDrpOptions, PresetItem } from 'ngx-mat-daterange-picker';
import { TokenService } from 'src/app/shared/services/token.service';
@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html'
})
export class AppDashboardComponent implements OnInit {
  @ViewChild('dateRangePicker', { static: false }) dateRangePicker;
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
  allProjects: ProjectDetails[];
  searchText = '';
  filterForm: FormGroup;
  currentIndex: number = 0;
  isSideNavCollapsed: boolean;
  constructor(public dialog: MatDialog,
    private router: Router,
    private formbuilder: FormBuilder,
    private _userService: UserService,
    private userguideservice: UserGuideService,
    private _projectService: ProjectService,
    private commonService: CommonService,
    private tokenService: TokenService,
    private permissionService: PermissionService) { }

  range: Range = { fromDate: new Date(), toDate: new Date() };
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];

  currencyCode: string;


  ngOnInit() {
    this.formInit()
    this.datePickerConfig();
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
    if (!localStorage.getItem('ReleaseNotes') || (localStorage.getItem('ReleaseNotes') != '1')) {
      localStorage.setItem('ReleaseNotes', '0');
    }
    if (localStorage.getItem('ReleaseNotes') == '0') {
      this.userguideservice.userGetReleaseNote().then(res => {
        if (res.status == 1) {
          this.openReleaseNote(res.data.releasText, res.data.releaseNoteId);
        }
        if (res.status == 0) {
          localStorage.setItem('ReleaseNotes', '1');
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

  ngOnChanges(): void {

  }

  datePickerConfig() {
    const today = new Date();
    const tempDate = new Date();
    const fromMin = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const fromMax = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const toMin = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const toMax = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: 'mediumDate',
      range: { fromDate: new Date(tempDate.setDate(tempDate.getDate() - 30)), toDate: today },
      applyLabel: 'Submit',
      placeholder: 'Choose Date',
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: true,
        hasBackdrop: true
      }
      // cancelLabel: "Cancel",
      // excludeWeekends:true,
      // fromMinMax: {fromDate:fromMin, toDate:fromMax},
      // toMinMax: {fromDate:toMin, toDate:toMax}
    };
  }

  updateRange(range: Range) {
    this.range = range;
    this.getDashboardInfo(this.label);
  }

  setupPresets() {

    const backDate = (numOfDays) => {
      const today = new Date();
      return new Date(today.setDate(today.getDate() - numOfDays));
    }

    const today = new Date();
    const yesterday = backDate(1);
    const minus7 = backDate(7)
    const minus30 = backDate(30);
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    this.presets = [
      { presetLabel: "Yesterday", range: { fromDate: yesterday, toDate: today } },
      { presetLabel: "Last 7 Days", range: { fromDate: minus7, toDate: today } },
      { presetLabel: "Last 30 Days", range: { fromDate: minus30, toDate: today } },
      { presetLabel: "This Month", range: { fromDate: currMonthStart, toDate: currMonthEnd } },
      { presetLabel: "Last Month", range: { fromDate: lastMonthStart, toDate: lastMonthEnd } }
    ]
  }

  formInit() {
    this.filterForm = this.formbuilder.group({
      projectFilter: []
    })
    this.filterForm.get('projectFilter').valueChanges.subscribe(val => {
      this.getDashboardInfo(this.label)
    })
    // this.filterForm.get('termFilter').valueChanges.subscribe(val => {
    //   this.getDashboardInfo(this.label)
    // })
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

  openReleaseNote(data, releaseNoteId) {

    const dialogRef = this.dialog.open(ReleaseNoteComponent, {
      disableClose: true,
      width: "500px", data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result == 'closed') {
        // post api hit user/add/releaseNote
        const obj = {
          "releaseNoteId": releaseNoteId
        }
        this.userguideservice.sendReleaseNoteData(obj).then(res => {
          localStorage.setItem('ReleaseNotes', '1');
        })
      }
    });
  }

  getFormatedDate(formatdate) {
    let date = new Date(this.commonService.formatDate(formatdate))
    let dummyMonth = date.getMonth() + 1;
    const year = date.getFullYear().toString();
    const month = dummyMonth > 9 ? dummyMonth.toString() : "0" + dummyMonth.toString();
    const day = date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();
    return year + "-" + month + "-" + day;
  }

  getDashboardInfo(label) {
    let projectIds = this.filterForm.get("projectFilter").value && this.filterForm.get("projectFilter").value.map(val => {
      return val.projectId;
    })
    const data = {
      "orgId": this.orgId,
      "startDate": this.getFormatedDate(this.range.fromDate),
      "endDate": this.getFormatedDate(this.range.toDate),
      "dataSource": label,
      "range": "Custom",
      "projectList": projectIds ? projectIds : []
    }
    this._userService.getDashboardData(data).then(res => {
      if (res.data.currencyCode) {
        this.currencyCode = res.data.currencyCode;
      }
      if (label == 'po')
        this.poData = res.data;

      if (label == 'rfq')
        this.rfqData = res.data;

      if (label == 'indent')
        this.indentData = res.data;
    })
  }

  onTabChanged($event) {
    this.currentIndex = $event.index;
    switch (this.currentIndex) {
      case 0: {
        this.tokenService.getRole()
        this.label = this.tokenService.getRole().toLowerCase() !== 'l3' ? 'po' : 'indent';
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
      this.allProjects = res.data
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
      this.getProjectsNumber();
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
    if (event.currentTarget.innerWidth <= 494) {
      this.tab1 = "P.O.";
      this.tab2 = "RFQ";
    } else {
      this.tab1 = "Purchase Orders";
      this.tab2 = "Request for Quotations";
    }
  }

  isSidebarCollapsed(e){
    this.isSideNavCollapsed = e;
  }
}