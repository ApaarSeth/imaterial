import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import {
  ProjectDetails,
  ProjetPopupData
} from "src/app/shared/models/project-details";
import { DoubleConfirmationComponent } from "src/app/shared/dialogs/double-confirmation/double-confirmation.component";
import { AddProjectComponent } from "src/app/shared/dialogs/add-project/add-project.component";
import { MatDialog } from "@angular/material";
import { IndentVO } from "src/app/shared/models/indent";
import { IndentService } from "src/app/shared/services/indent/indent.service";

export interface PeriodicElement {
  materialName: string;
  estimatedQty: number;
  quantity: number;
  dueDate: Date;
  materialId: number;
  materialUnit: string;
  projectId: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    materialName: "Steelbar 15MM",
    estimatedQty: 200,
    quantity: null,
    dueDate: null,
    materialId: 1,
    materialUnit: "MT",
    projectId: 8
  },
  {
    materialName: "Steelbar 15MM",
    estimatedQty: 200,
    quantity: null,
    dueDate: null,
    materialId: 2,
    materialUnit: "MT",
    projectId: 8
  },
  {
    materialName: "Steelbar 15MM",
    estimatedQty: 200,
    quantity: null,
    dueDate: null,
    materialId: 3,
    materialUnit: "MT",
    projectId: 8
  },
  {
    materialName: "Steelbar 15MM",
    estimatedQty: 200,
    quantity: null,
    dueDate: null,
    materialId: 4,
    materialUnit: "MT",
    projectId: 8
  },
  {
    materialName: "Steelbar 15MM",
    estimatedQty: 200,
    quantity: null,
    dueDate: null,
    materialId: 5,
    materialUnit: "MT",
    projectId: 8
  },
  {
    materialName: "Steelbar 15MM",
    estimatedQty: 200,
    quantity: null,
    dueDate: null,
    materialId: 6,
    materialUnit: "MT",
    projectId: 8
  },
  {
    materialName: "Steelbar 15MM",
    estimatedQty: 200,
    quantity: null,
    dueDate: null,
    materialId: 7,
    materialUnit: "MT",
    projectId: 8
  }
];

@Component({
  selector: "dashboard",
  templateUrl: "./indent-dashboard.component.html",
  styleUrls: ["../../../assets/scss/main.scss"]
})
export class IndentDashboardComponent implements OnInit {
  dueDate = new Date(1990, 0, 1);
  userId: 1;
  searchText: string = null;
  projectId: number;
  product: ProjectDetails;
  displayedColumns: string[] = [
    "Material Name",
    "Estimated Quantity",
    "Required Quantity",
    "Required Date"
  ];
  dataSource = ELEMENT_DATA;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private indentService: IndentService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params["id"];
    });
    //this.product = history.state.projectDetails;
    this.getProject(this.projectId);
  }
  getProject(id: number) {
    this.projectService.getProject(1, id).then(data => {
      this.product = data.data;
    });
  }
  showIndent(dataSource) {
    console.log("qwerty", dataSource);
    this.router.navigate(["/indent/" + this.projectId + "/indent-detail"]);
    this.raiseIndent(dataSource);
  }

  raiseIndent(indentVO: IndentVO[]) {
    console.log("qwertyuio", indentVO);
    this.indentService.raiseIndent(this.projectId, indentVO).then(res => {
      console.log(res);
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
        width: "700px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => {
          //console.log('The dialog was closed');
          //this.animal = result;
        });
    } else if (data.isDelete == true) {
      const dialogRef = this.dialog.open(DoubleConfirmationComponent, {
        width: "500px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(result => {
          //console.log('The dialog was closed');
          //this.animal = result;
        });
    }
  }
}