import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, SimpleChanges } from "@angular/core";
import { MatDialog, MatChipInputEvent, MatTableDataSource } from "@angular/material";
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
import { forEachChild } from 'typescript';
import { GuidedTour, Orientation, GuidedTourService } from 'ngx-guided-tour';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { SupplierAdd } from 'src/app/shared/models/supplier';

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
  searchText: string = null;
  projects: FormControl;
  selectedProjects: ProjectDetails[] = [];
  projectIds: number[] = [];
  supplierIds: number[] = [];
  rfqDetails: RfqMaterialResponse[] = [];
  materialForm: FormGroup;
  counter: number;
  addRfq: AddRFQ;

  allSuppliers: SupplierAdd[];
  selectedSupplier: SupplierAdd[] = [];
  alreadySelectedSupplierId: number[];

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
    private commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.allSuppliers = this.activatedRoute.snapshot.data.SupplierLiabilityReportResolver[0].data;
    this.allProjects = this.activatedRoute.snapshot.data.SupplierLiabilityReportResolver[1].data;

    this.formInit();
    this.getNotifications();
  }


  formInit() {
    this.form = this.formBuilder.group({
      selectedProject: [''],
      selectedSupplier: ['']
    });
  }
  choosenProject() {
    this.projectIds = [];
    this.projectIds = this.form.value.selectedProject.map(
      selectedProject => selectedProject.projectId
    );
    this.sendProjectSuppierData();
  }

  choosenSupplier() {
    this.supplierIds = [];
    this.supplierIds = this.form.value.selectedSupplier.map(
      selectedSupplier => selectedSupplier.supplierId
    );
    this.sendProjectSuppierData();
  }

  sendProjectSuppierData() {
    const obj = {
      "projectIds": this.projectIds,
      "supplierIds": this.supplierIds
    }
  }

  getNotifications() {
    this.commonService.getNotification(this.userId);
  }

  setLocalStorage() {
  }

}