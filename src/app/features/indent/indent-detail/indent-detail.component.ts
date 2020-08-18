import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import {
  ProjectDetails,
  ProjetPopupData
} from "src/app/shared/models/project-details";
import { DoubleConfirmationComponent } from "src/app/shared/dialogs/double-confirmation/double-confirmation.component";
import { AddProjectComponent } from "src/app/shared/dialogs/add-project/add-project.component";
import { AllIndentListVO, IndentVO } from "src/app/shared/models/indent";
import { AdvanceSearchService } from 'src/app/shared/services/advance-search.service';
import { Subscription } from 'rxjs';
import { IndentService } from 'src/app/shared/services/indent/indent.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { MatDialog } from "@angular/material/dialog";

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
export class IndentDetailComponent implements OnInit, OnDestroy {
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
  susbcriptions: Subscription[] = [];
  isFilter: boolean;

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
      this.projectId = params["id"];
    });
    this.isMobile = this.commonService.isMobile().matches;
    this.orgId = Number(localStorage.getItem("orgId"));
    this.getProject(this.projectId);
    this.allIndents = this.route.snapshot.data.indentList;
    this.dataSource1 = this.allIndents.ongoingIndentList;
    this.dataSource2 = this.allIndents.completedIndentList;
    this.startSubscriptions();
  }

  startSubscriptions() {
    this.susbcriptions.push(
      this.advSearchService.indentFilterRequest$.subscribe(res => {
        res.projectId = Number(this.projectId);
        this.indentService.getIndentList(this.projectId, res).then(data => {
          this.allIndents = data.data;
          this.dataSource1 = this.allIndents.ongoingIndentList;
          this.dataSource2 = this.allIndents.completedIndentList;
        })
        this.isFilter = false;
      }),
      this.advSearchService.indentFilterExportRequest$.subscribe(res => {
        res.projectId = Number(this.projectId);
        this.indentService.postIndentExport(res).then(data => {
          if (data.data.url) {
            window.open(data.data.url);
          }
        });
        this.isFilter = false;
      })
    )
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

  ngOnDestroy() {
    this.susbcriptions.forEach(itm => itm.unsubscribe());
  }

  openFilter() {
    this.isFilter = true;
  }

  closeFilter() {
    this.isFilter = false;
  }

}