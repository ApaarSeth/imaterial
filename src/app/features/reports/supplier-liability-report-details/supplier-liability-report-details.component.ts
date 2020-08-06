import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, SimpleChanges } from "@angular/core";
import { MatDialog, MatChipInputEvent, MatTableDataSource, MatMenuTrigger } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ProjectDetails,
  ProjectIds
} from "src/app/shared/models/project-details";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { stringify } from "querystring";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  RfqMat,
  RfqMaterialResponse,
  AddRFQ
} from "src/app/shared/models/RFQ/rfq-details";
import { AddAddressDialogComponent } from "src/app/shared/dialogs/add-address/address-dialog.component";
import { AddEditUserComponent } from 'src/app/shared/dialogs/add-edit-user/add-edit-user.component';
import { UserDetailsPopUpData, AllUserDetails, UserAdd } from 'src/app/shared/models/user-details';
import { DeactiveUserComponent } from 'src/app/shared/dialogs/disable-user/disable-user.component';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { forEachChild, idText } from 'typescript';
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { SupplierAdd } from 'src/app/shared/models/supplier';
import { SupplierLiabilityReport } from 'src/app/shared/models/supplierLiabiltityReport.model';
import { ReportService } from 'src/app/shared/services/supplierLiabilityReport.service';

// chip static data
export interface Fruit {
  name: string;
}


const ELEMENT_DATA: AllUserDetails[] = [];

@Component({
  selector: "supplier-liability-report-details",
  templateUrl: "./supplier-liability-report-details.component.html"
})


export class SupplierLiabilityReportDetailComponent implements OnInit {
  @ViewChild(MatMenuTrigger, { static: false }) triggerBtn: MatMenuTrigger;
  displayedColumns: string[] = ['User Name', 'Email Id', 'Phone', 'Role', 'Project', 'star'];
  displayedColumnsDeactivate: string[] = ['User Name', 'Email Id', 'Phone', 'Role', 'Project'];
  dataSourceActivateTemp = ELEMENT_DATA;
  dataSourceDeactivateTemp = ELEMENT_DATA;
  allProjects: ProjectDetails[];
  dataSourceActivate: MatTableDataSource<AllUserDetails>;
  dataSourceDeactivate: MatTableDataSource<AllUserDetails>;
  userDetailsTemp: UserAdd = {};
  deactivateUsers: Array<UserAdd> = new Array<UserAdd>();
  activateUsers: Array<UserAdd> = new Array<UserAdd>();
  conversionNumber: number
  addUserBtn: boolean = false;
  allUsers: AllUserDetails;
  orgId: number;

  // public UserDashboardTour: GuidedTour = {
  //   tourId: 'supplier-tour',
  //   useOrb: false,
  //   steps: [
  //     {
  //       title: 'Add User',
  //       selector: '.add-user-button',
  //       content: 'Click here to add other users of your organisation.',
  //       orientation: Orientation.Left
  //     }
  //   ],
  //     skipCallback: () => {
  //     this.setLocalStorage()
  //   },
  //   completeCallback: () => {
  //     this.setLocalStorage()
  //   }
  // };
  userId: number;
  form: FormGroup;
  alreadySelectedId: number[];
  checkedProjectList: RfqMaterialResponse[] = [];
  checkedProjectIds: number[] = [];
  searchSupplier: string = '';
  searchProject: string = ''
  projects: FormControl;
  selectedProjects: ProjectDetails[] = [];
  projectIds: number[] = [];
  supplierIds: number[] = [];
  rfqDetails: RfqMaterialResponse[] = [];
  materialForm: FormGroup;
  counter: number;
  addRfq: AddRFQ;
  supplierLiabiltyReportData: SupplierLiabilityReport
  allSuppliers: SupplierAdd[];
  selectedSupplier: SupplierAdd[] = [];
  alreadySelectedSupplierId: number[];
  amountRange: string[];
  selectedMenu: string;
  currency: string;
  isMobile: boolean;
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router,
    private ref: ChangeDetectorRef,
    private userService: UserService,
    private guidedTourService: GuidedTourService,
    private userGuideService: UserGuideService,
    private commonService: CommonService,
    private reportService: ReportService
  ) {
  }

  ngOnInit() {
    this.conversionNumber = 1;
    this.isMobile = this.commonService.isMobile().matches;
    let countryCode = localStorage.getItem("countryCode")
    this.currency = localStorage.getItem("currencyCode")
    this.amountRange = countryCode === 'IN' ? ['Full Figures', 'Lakhs', 'Crores'] : ['Full Figures', 'Thousands', 'Millions', 'Billions']
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.allSuppliers = this.activatedRoute.snapshot.data.resolverData[0].data;
    this.allProjects = this.activatedRoute.snapshot.data.resolverData[1].data;
    this.formInit();
    this.getNotifications();
    this.selectedMenu = 'Full Figures'
  }

  // focus() {
  //   this.triggerBtn.focus('mouse')
  // }

  formInit() {
    this.form = this.formBuilder.group({
      selectedProject: [''],
      selectedSupplier: [''],
      amountDisplay: ['Full figures']
    });

    this.form.get('amountDisplay').valueChanges.subscribe(res => {
      console.log(res)
    })
  }

  choosenProject() {
    this.projectIds = [];
    this.projectIds = this.form.value.selectedProject.map(
      selectedProject => String(selectedProject.projectId)
    );
    this.sendProjectSuppierData();
  }

  choosenSupplier() {
    this.supplierIds = [];
    this.supplierIds = this.form.value.selectedSupplier.map(
      selectedSupplier => String(selectedSupplier.supplierId)
    );
    this.sendProjectSuppierData();
  }

  sendProjectSuppierData() {
    const obj = {
      "projectIdList": this.projectIds,
      "supplierIdList": this.supplierIds
    }
    this.reportService.getSupplierLiabilityReport(obj).then(res => {
      this.supplierLiabiltyReportData = res;
    })
  }

  getNotifications() {
    this.commonService.getNotification(this.userId);
  }

  setLocalStorage() {
  }

  clickMenuItem(menuItem) {
    this.selectedMenu = menuItem;
    switch (this.selectedMenu) {
      case 'Lakhs':
        this.conversionNumber = 100000
        break;
      case 'Crores':
        this.conversionNumber = 10000000
        break;
      case 'Thousands':
        this.conversionNumber = 1000
        break;
      case 'Millions':
        this.conversionNumber = 1000000
        break;
      case 'Billions':
        this.conversionNumber = 1000000000
        break;
      default:
        this.conversionNumber = 1
        break;
    }
  }

  downloadExcel() {

    const data = {
      "projectIdList": this.projectIds,
      "supplierIdList": this.supplierIds
    }

    this.reportService.supplierLiabilityExcelDownload(data).then(res => {
      if (res.data) {
        var win = window.open(res.data.url, "_blank");
        win.focus();
      }
    })
  }
}