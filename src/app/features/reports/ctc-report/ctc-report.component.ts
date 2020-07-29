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
import { ProjectService } from 'src/app/shared/services/projectDashboard/project.service';

const ELEMENT_DATA: AllUserDetails[] = [];

@Component({
  selector: "ctc-report",
  templateUrl: "./ctc-report.component.html"
})

export class CTCReportComponent implements OnInit {
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
  userId: number;
  form: FormGroup;
  alreadySelectedId: number[];
  checkedProjectList: RfqMaterialResponse[] = [];
  checkedProjectIds: number[] = [];
  searchText: string = null;
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

  allProjectsList: ProjectDetails[] = [];

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private ref: ChangeDetectorRef,
    private userService: UserService,
    private guidedTourService: GuidedTourService,
    private userGuideService: UserGuideService,
    private commonService: CommonService,
    private reportService: ReportService,
    private _projectService: ProjectService,
    private _rfqService: RFQService,
  ) {
  }

  ngOnInit() {
    this.conversionNumber = 1;
    let countryCode = localStorage.getItem("countryCode");
    this.amountRange = countryCode === 'IN' ? ['Full Figures', 'Lakhs', 'Crores'] : ['Full Figures', 'Thousands', 'Millions']
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.allSuppliers = this.activatedRoute.snapshot.data.resolverData[0].data;
    this.allProjects = this.activatedRoute.snapshot.data.resolverData[1].data;
    this.formInit();
    this.selectedMenu = 'Full Figures'

    this.getAllProjects();
  }

  /**
   * @description to get all projects list
   */
  getAllProjects() {
    this._projectService.getProjects(this.orgId, this.userId).then(res => {
      if (res.data) {
        this.allProjectsList = res.data;
      }
    })
  }

  /**
   * @description to get all materials of selected project in dropdown
   * @param projectId project id of selected project in dropdown list
   */
  getProjectMaterials(){
    const selectedIds = this.form.value.selectedProject.map(selectedProject => selectedProject);
  }

  focus() {
    this.triggerBtn.focus('mouse')
  }

  formInit() {
    this.form = this.formBuilder.group({
      selectedProject: [''],
      amountDisplay: ['Full figures']
    });

    this.form.get('amountDisplay').valueChanges.subscribe(res => {
      console.log(res)
    })
  }

  choosenProject() {
    this.projectIds = [];
    this.projectIds = this.form.value.selectedProject.map(
      selectedProject => selectedProject.projectId
    );
    this.sendProjectSuppierData();
  }

  sendProjectSuppierData() {
    const obj = {
      "projectIds": this.projectIds,
      "supplierIds": this.supplierIds
    }
  }

  ngAfterViewInit() {
    this.focus()
  }

  clickMenuItem(menuItem) {
    console.log(menuItem);
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
      case 'Million':
        this.conversionNumber = 1000000
        break;
      default:
        this.conversionNumber = 1
        break;
    }
  }
}

