import { AdvSearchConfig, AdvSearchOption, AdvSearchData } from './../../../shared/models/adv-search.model';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ProjectDetails, ProjetPopupData } from "../../../shared/models/project-details";
import { AllIndentListVO, IndentVO } from "../../../shared/models/indent";
import { forkJoin } from "rxjs";
import { ProjectService } from "../../../shared/services/project.service";
import { AdvanceSearchService } from "../../../shared/services/advance-search.service";
import { IndentService } from "../../../shared/services/indent.service";
import { CommonService } from "../../../shared/services/commonService";
import { AddProjectComponent } from "../../../shared/dialogs/add-project/add-project.component";
import { DoubleConfirmationComponent } from "../../../shared/dialogs/double-confirmation/double-confirmation.component";

export interface IndentData {
  indentName: string;
  requestedDate: number;
  totalNoOfMaterial: number;
  createdBy: string;
  date: number;
}

@Component({
  selector: "app-indent-detail",
  templateUrl: "./indent-detail.component.html"
})
export class IndentDetailComponent implements OnInit {
  product: ProjectDetails;
  projectId: number;

  displayedColumns: string[] = [
    "Indent Number",
    "Indented Date",
    "Total No Of Material",
    "Created By",
    "View Indent"
  ];

  allIndents: AllIndentListVO;
  dataSource1: IndentVO[];
  dataSource2: IndentVO[];
  orgId: number;
  isMobile: boolean;
  isFilter: boolean;

  searchConfig: AdvSearchConfig;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private advSearchService: AdvanceSearchService,
    private indentService: IndentService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params[ "id" ];
    });
    this.isMobile = this.commonService.isMobile().matches;
    this.orgId = Number(localStorage.getItem("orgId"));
    this.getProject(this.projectId);
    this.allIndents = this.route.snapshot.data.indentList;
    this.dataSource1 = this.allIndents.ongoingIndentList;
    this.dataSource2 = this.allIndents.completedIndentList;
    this.getSearchReady();
  }


  getSearchReady(): void {
    const options: AdvSearchOption[] = [
      {
        name: "Material Name",
        type: "MULTI_SELECT_SEARCH",
        key: "materialCodeList"
      }, {
        name: "Raised By",
        type: "MULTI_SELECT_SEARCH",
        key: "indentRaisedByList"
      }, {
        name: "Request Status",
        type: "MULTI_SELECT",
        key: "indentStatus"
      }, {
        name: "Raised Date",
        type: 'DATE',
        key: {
          "from": "indentRaisedStartDate",
          "to": "indentRaisedEndDate"
        }
      }, {
        name: "Required Date",
        type: 'DATE',
        key: {
          "from": "indentRequestStartDate",
          "to": "indentRequestEndDate"
        }
      }
    ]
    forkJoin([ this.advSearchService.getMaterials(), this.advSearchService.getAllUsers(this.orgId) ]).toPromise().then(res => {
      options[ 0 ].data = res[ 0 ] as AdvSearchData[];
      options[ 1 ].data = res[ 1 ] as AdvSearchData[];
      options[ 2 ].data = this.advSearchService.getReqStatus() as AdvSearchData[];
      options[ 3 ].data = this.advSearchService.getRaisedDates() as AdvSearchData[];
      options[ 4 ].data = this.advSearchService.getRaisedDates() as AdvSearchData[];

      this.searchConfig = {
        title: "Advance Search",
        type: "PO",
        options
      }
    });
  }

  getProject(id: number) {
    this.projectService.getProject(this.orgId, id).then(data => {
      this.product = data.data;
    });
  }

  // dialog function

  editProject() {
    const data: ProjetPopupData = {
      isEdit: true,
      isDelete: false,
      detail: this.product
    };

    this.openDialog(data);
  }

  deleteProject() {
    const data: ProjetPopupData = {
      isEdit: false,
      isDelete: true,
      detail: this.product
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
        .then(result => { });
    } else if (data.isDelete == true) {
      const dialogRef = this.dialog.open(DoubleConfirmationComponent, {
        width: "500px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => { });
    }
  }

  viewIndentDetails(row) {
    this.router.navigate([
      "/indent/" + this.projectId + "/single-indent/" + row.indentId
    ]);
  }

  openFilter() {
    this.isFilter = true;
  }

  closeFilter() {
    this.isFilter = false;
  }

  applySearch(data) {
    data.projectId = Number(this.projectId);
    this.indentService.getIndentList(this.projectId, data).then(data => {
      this.allIndents = data.data;
      this.dataSource1 = this.allIndents.ongoingIndentList;
      this.dataSource2 = this.allIndents.completedIndentList;
    })
    this.isFilter = false;
  }

  applyExport(data) {
    data.projectId = Number(this.projectId);
    this.indentService.postIndentExport(data).then(data => {
      if (data.data.url) {
        window.open(data.data.url);
      }
    });
    this.isFilter = false;
  }

}