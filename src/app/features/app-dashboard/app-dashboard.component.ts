import { GoogleChartService } from './../../shared/services/google-chart.service';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { AddProjectComponent } from "../../shared/dialogs/add-project/add-project.component";
import { Router } from '@angular/router';
import { PurchaseOrderData } from '../../shared/models/po-details/po-details-list';
import { ProjectDetails } from '../../shared/models/project-details';
import { permission } from '../../shared/models/permissionObject';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../shared/services/user.service';
import { UserGuideService } from '../../shared/services/user-guide.service';
import { ProjectService } from '../../shared/services/project.service';
import { CommonService } from '../../shared/services/commonService';
import { TokenService } from '../../shared/services/token.service';
import { PermissionService } from '../../shared/services/permission.service';
import { AppNotificationService } from '../../shared/services/app-notification.service';
import { NgxDrpOptions, PresetItem } from 'ngx-mat-daterange-picker';
import { ReleaseNoteComponent } from '../../shared/dialogs/release-notes/release-notes.component';
import { SelectProjectComponent } from '../../shared/dialogs/select-project/select-project.component';
import { ViewVideoComponent } from '../../shared/dialogs/video-video/view-video.component';
import { GuideTourModel } from '../../shared/models/guided_tour';
import { DateRange } from '../../shared/models/datePicker';

@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html'
})
export class AppDashboardComponent implements OnInit {
  @ViewChild('dateRangePicker') dateRangePicker;
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
  // isSideNavCollapsed: boolean;
  isMobile: boolean;
  cntryList: any[];
  isAdDisplay: string;
  diffDays: number
  rangeType: string = 'Custom';
  newDiffDays: number;
  prText: string;

  constructor(public dialog: MatDialog,
    private router: Router,
    private chartService: GoogleChartService,
    private formbuilder: FormBuilder,
    private _userService: UserService,
    private userguideservice: UserGuideService,
    private _projectService: ProjectService,
    private commonService: CommonService,
    private tokenService: TokenService,
    private permissionService: PermissionService,
    private notifier: AppNotificationService,
  ) { }

  range: DateRange = { fromDate: new Date(), toDate: new Date() };
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];
  currencyCode: string;
  projectData

  ngOnInit() {
    this.isAdDisplay = localStorage.getItem("callingCode");
    // this.cntryList = this.activatedRoute.snapshot.data.countryList;
    this.formInit()
    this.datePickerConfig();
    this.isMobile = this.commonService.isMobile().matches;
    const role = localStorage.getItem("role")
    if (role) {
      this.permissionObj = this.permissionService.checkPermission(role);
      this.label = this.permissionObj.rfqFlag ? 'po' : 'indent';
      this.permissionObj.rfqFlag ? this.poData = {} as PurchaseOrderData : this.indentData = {} as PurchaseOrderData
      this.orgId = Number(localStorage.getItem("orgId"));
    }
    this.userId = Number(localStorage.getItem("userId"));


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


    Promise.all([this.userguideservice.getUserGuideFlag(),
    this._projectService.getProjects(this.orgId, this.userId),
    this.commonService.getNotification(this.userId)]).then(res => {
      this.userGuidedata = res[0].data;
      this.userGuidedata.forEach(element => {
        localStorage.setItem(element.moduleName, element.enableGuide);
      });
      this.projectData = res[1];
      this.getProjectsNumber()
    })
    this.isMobile ? this.prText = 'PR' : this.prText = 'Purchase Requisitions (PR)';
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
      range: { fromDate: new Date(today.getFullYear(), 0, 1), toDate: new Date(today.getFullYear(), 12, 0) },
      applyLabel: 'Submit',
      placeholder: 'Choose Date',
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: true,
        hasBackdrop: true
      },
      // cancelLabel: "Cancel",
      // excludeWeekends:true,
      // fromMinMax: {fromDate:fromMin, toDate:fromMax},
      // toMinMax: { fromDate: toMin, toDate: toMax }
    };
  }

  updateRange(range: DateRange) {
    this.range = range;
    if (range.toDate < range.fromDate) {
      this.notifier.snack("To date can'nt be earlier than from date")
    }
    else {
      const diffTime = Math.abs(range.fromDate.getTime() - range.toDate.getTime());
      this.diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.getDashboardInfo(this.label);
      // if (!this.newDiffDays) {
      //   this.newDiffDays = this.diffDays;
      //   this.getDashboardInfo(this.label);
      // }
      // else if (this.newDiffDays !== this.diffDays) {
      //   this.newDiffDays = this.diffDays;
      //   this.getDashboardInfo(this.label);
      // }
    }
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
    const quarterFromDate = this.getQuartrDateRange().fromdate;
    const quarterLastDate = this.getQuartrDateRange().toDate;
    const yearFromDate = new Date(today.getFullYear(), 0, 1);
    const yearToDate = new Date(today.getFullYear(), 12, 0);
    this.presets = [
      // { presetLabel: "Yesterday", range: { fromDate: yesterday, toDate: today } },
      { presetLabel: "Last 7 Days", range: { fromDate: minus7, toDate: today } },
      // { presetLabel: "Last 30 Days", range: { fromDate: minus30, toDate: today } },
      { presetLabel: "This Month", range: { fromDate: currMonthStart, toDate: currMonthEnd } },
      { presetLabel: "Last Month", range: { fromDate: lastMonthStart, toDate: lastMonthEnd } },
      // { presetLabel: "Quarter", range: { fromDate: quarterFromDate, toDate: quarterLastDate } },
      { presetLabel: "Yearly ", range: { fromDate: yearFromDate, toDate: yearToDate } }
    ]
  }

  getQuartrDateRange(): { fromdate: Date, toDate: Date } {
    const today = new Date();
    const currentMonth = today.getMonth() + 1
    if (1 <= currentMonth && currentMonth < 4) {
      return { fromdate: new Date(today.getFullYear(), 0, 1), toDate: new Date(today.getFullYear(), 3, 0) }
    }
    else if (4 <= currentMonth && currentMonth < 7) {
      return { fromdate: new Date(today.getFullYear(), 3, 1), toDate: new Date(today.getFullYear(), 6, 0) }
    }
    else if (7 <= currentMonth && currentMonth < 10) {
      return { fromdate: new Date(today.getFullYear(), 6, 1), toDate: new Date(today.getFullYear(), 9, 0) }
    }
    else if (10 <= currentMonth) {
      return { fromdate: new Date(today.getFullYear(), 9, 1), toDate: new Date(today.getFullYear(), 12, 0) }
    }
  }

  formInit() {
    this.filterForm = this.formbuilder.group({
      projectFilter: [],
      poFilter: [],
      rfpFilter: []
    })
    this.filterForm.get('projectFilter').valueChanges.subscribe(val => {
      this.getDashboardInfo(this.label)
    })
    this.filterForm.get('poFilter').valueChanges.subscribe(val => {
      this.getDashboardInfo(this.label)
    })
    this.filterForm.get('rfpFilter').valueChanges.subscribe(val => {
      this.getDashboardInfo(this.label)
    })
  }

  getNotifications() {
    this.commonService.getNotification(this.userId);
  }

  openProject() {
    this.commonService.getCountry().then(res => {
      let data = {
        isEdit: false,
        isDelete: false,
        countryList: res.data
      };
      const dialogRef = this.dialog.open(AddProjectComponent, {
        width: "1000px",
        data
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result != null)
          this.router.navigate(['/project-dashboard']);
      });
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

  getRange() {
    if (this.diffDays <= 31) {
      return 'Custom'
    } else if (88 <= this.diffDays && this.diffDays <= 93) {
      return 'Weekly'
    } else if (365 <= this.diffDays && this.diffDays <= 366) {
      return 'Yearly'
    }
    else {
      return null
    }
  }

  getFilter(label) {
    let poFilter
    let rfpFilter
    if (label == 'po') {
      poFilter = this.filterForm.get("poFilter") && this.filterForm.get("poFilter").value ? this.filterForm.get("poFilter").value : 'all'
    }
    if (label == 'rfq') {
      rfpFilter = this.filterForm.get("rfpFilter") && this.filterForm.get("rfpFilter").value ? this.filterForm.get("rfpFilter").value : 'all'
    }

    if (label == 'po') {
      return poFilter ? poFilter : 'all'
    }
    else if (label == 'rfq') {
      return rfpFilter ? rfpFilter : 'all'
    }
    else {
      return null
    }
  }

  getDashboardInfo(label) {
    let projectIds = this.filterForm.get("projectFilter").value && this.filterForm.get("projectFilter").value.map(val => {
      return val.projectId;
    })
    this.rangeType = this.getRange()
    if (this.rangeType) {
      const data = {
        "orgId": this.orgId,
        "startDate": this.getFormatedDate(this.range.fromDate),
        "endDate": this.getFormatedDate(this.range.toDate),
        "dataSource": label,
        "range": this.rangeType,
        "projectList": projectIds ? projectIds : [],
        "fliterFlag": this.getFilter(label)
      }
      this._userService.getDashboardData(data, true).then(res => {
        if (res.data.currencyCode) {
          this.currencyCode = res.data.currencyCode;
        }
        if (label == 'po') {
          this.poData = res.data;
          let chartData = data.range === 'Yearly' ? this.sortGraphData(this.poData.graphData ? this.poData.graphData : null) : this.poData.graphData;
          this.chartService.barChartData.next(chartData ? [...chartData] : null)
        }
        if (label == 'rfq') {
          this.rfqData = res.data;
          let chartData = data.range === 'Yearly' ? this.sortGraphData(this.rfqData.graphData ? this.rfqData.graphData : null) : this.rfqData.graphData;
          this.chartService.barChartData.next(chartData ? [...chartData] : null)
        }
        if (label == 'indent') {
          this.indentData = res.data;
          this.chartService.pieChartData.next([['PRs', 'Vaue'],
          ['Fullfilled PRs', this.indentData.totalCount],
          ['Raised PRs', this.indentData.totalValue],
          ])
        }
      }).catch(error => console.log(error))
    }
    else {
      this.notifier.snack('Selected date range can not be greater than 31 days')
    }
  }

  sortGraphData(graphData: Array<any>) {
    if (graphData) {
      let tempGraphData = graphData.slice(1, graphData.length)
      var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      tempGraphData.sort(function (a, b) {
        return months.indexOf(a[0])
          - months.indexOf(b[0]);
      });
      tempGraphData.splice(0, 0, graphData[0])
      return tempGraphData;
    } else {
      return null;
    }
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
    this.allProjects = this.projectData.data
    this.projectCount = this.projectData.data ? this.projectData.data.length : 0;
    this.projectLists = this.projectData.data;
  }

  openBomDialog() {
    const dialogRef = this.dialog.open(SelectProjectComponent, {
      width: "800px",
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

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (event.currentTarget.innerWidth <= 494) {
      this.tab1 = "P.O.";
      this.tab2 = "RFPs";
    } else {
      this.tab1 = "Purchase Orders (PO)";
      this.tab2 = "Request for Price (RFPs)";
    }
  }
}