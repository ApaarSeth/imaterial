import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import {
  ProjectDetails,
  ProjetPopupData
} from "src/app/shared/models/project-details";
import { DoubleConfirmationComponent } from "src/app/shared/dialogs/double-confirmation/double-confirmation.component";
import { AddProjectComponent } from "src/app/shared/dialogs/add-project/add-project.component";
import { MatDialog } from "@angular/material";
import { AllIndentListVO, IndentVO } from "src/app/shared/models/indent";

export interface IndentData {
  indentName: string;
  requestedDate: number;
  totalNoOfMaterial: number;
  createdBy: string;
  date: number;
}

@Component({
  selector: "app-indent-detail",
  templateUrl: "./indent-detail.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})
export class IndentDetailComponent implements OnInit {
  product: ProjectDetails;
  projectId: number;
  
displayedColumns: string[] = [
    "Indent Name",
    "Requested Date",
    "Total No Of Material",
    "Created By"
    // ,"Date"
  ];
  allIndents: AllIndentListVO;
  dataSource1: IndentVO[];
  dataSource2: IndentVO[];
  orgId: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params["id"];
    });
    this.orgId = Number(localStorage.getItem("orgId"));
    this.getProject(this.projectId);
    this.allIndents = this.route.snapshot.data.indentList;
    this.dataSource1 = this.allIndents.ongoingIndentList;
    this.dataSource2 = this.allIndents.completedIndentList;
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
        .then(result => {});
    } else if (data.isDelete == true) {
      const dialogRef = this.dialog.open(DoubleConfirmationComponent, {
        width: "500px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => {});
    }
  }
  viewIndentDetails(row) {
    console.log("row", row);
    this.router.navigate([
      "/indent/" + this.projectId + "/single-indent/" + row.indentId
    ]);
  }
}
