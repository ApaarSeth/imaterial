import { CommonService } from './../../shared/services/commonService';
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subcategory } from "../../shared/models/subcategory-materials";
import { ProjectDetails, ProjetPopupData } from "../../shared/models/project-details";
import { ProjectService } from "../../shared/services/project.service";
import { AppNavigationService } from "../../shared/services/navigation.service";
import { AddProjectComponent } from "../../shared/dialogs/add-project/add-project.component";
import { DoubleConfirmationComponent } from "../../shared/dialogs/double-confirmation/double-confirmation.component";
import { IndentService } from "../../shared/services/indent.service";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  materialName: string;
  estimatedQty: number;
  quantity: number;
  dueDate: Date;
  materialId: number;
  materialUnit: string;
  projectId: number;
}

@Component({
  selector: "dashboard",
  templateUrl: "./indent-dashboard.component.html"
})
export class IndentDashboardComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dataSource: MatTableDataSource<Subcategory>;
  dueDate = new Date(1990, 0, 1);
  subcategory: Subcategory[] = [];
  userId: 1;
  searchText: string = null;
  projectId: number;
  product: ProjectDetails;
  minDate = new Date();
  isMobile: boolean = false;
  displayedColumns: string[] = [
    "materialName",
    "estimatedQty",
    "requestedQuantity",
    "Required Quantity",
    "Required Date"
  ];

  materialForms: FormGroup;
  orgId: Number;
  startDateOfProject: Date;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private indentService: IndentService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private navService: AppNavigationService,
    private _snackBar: MatSnackBar,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.isMobile = this.commonService.isMobile().matches;
    this.orgId = Number(localStorage.getItem("orgId"))
    this.route.params.subscribe(params => {
      this.projectId = params["id"];
      this.getProject(this.projectId);
    });
    this.subcategory = this.indentService.raiseIndentData;

    if (this.subcategory) {
      this.dataSource = new MatTableDataSource(this.subcategory);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
          if (typeof data[sortHeaderId] === 'string') {
            return data[sortHeaderId].toLocaleLowerCase();
          }
          return data[sortHeaderId];
        };
      });
    }

    this.formsInit();
  }

  formsInit() {
    const frmArr = this.subcategory.map(subCat => {

      return new FormGroup({
        dueDate: new FormControl("", Validators.required),
        quantity: new FormControl("", {
          validators:
            [
              Validators.required,
              Validators.max(subCat.estimatedQty)
            ]
        })
      });
    });

    this.materialForms = this.formBuilder.group({
      forms: new FormArray(frmArr)
    });
  }

  getProject(id: number) {
    this.projectService.getProject(this.orgId, id).then(data => {
      this.product = data.data;
    });
  }

  showIndent() {
    this.materialForms.value.forms = this.materialForms.value.forms.map(material => {
      material.quantity = Number(material.quantity)
      return material;
    })
    const formValues = this.materialForms.value.forms;

    const dataSource = this.subcategory.map((cat, i) => {
      return { ...cat, ...formValues[i] };
    });
    this.indentService.raiseIndent(this.projectId, dataSource).then(res => {
      this._snackBar.open(res.message, "", {
        duration: 2000,
        panelClass: ["warning-snackbar"],
        verticalPosition: "bottom"
      });

      if (res.status == 1) {
        this.navService.gaEvent({
          action: 'submit',
          category: 'indent_created',
          label: null,
          value: null
        });
        this.router.navigate(["/indent/" + this.projectId + "/indent-detail"]);
      }

    });
  }


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
        data,
        panelClass: ['common-modal-style', 'add-project-dialog']
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(() => { });
    } else if (data.isDelete == true) {
      const dialogRef = this.dialog.open(DoubleConfirmationComponent, {
        width: "500px",
        data
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then(() => { });
    }
  }

  formatDate(oldDate): Date {
    let newDate = new Date(oldDate);
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    return newDate;
  }

  getStart(i) {
    this.materialForms.controls.forms.value[i].dueDate = this.formatDate(this.materialForms.controls.forms.value[i].dueDate);
  }

  startDate(event) {
    this.startDateOfProject = event;
  }
}