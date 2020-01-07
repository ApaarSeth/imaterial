import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import {
  ProjectDetails,
  ProjetPopupData
} from "src/app/shared/models/project-details";
import { AddProjectComponent } from "src/app/shared/dialogs/add-project/add-project.component";
import { DoubleConfirmationComponent } from "src/app/shared/dialogs/double-confirmation/double-confirmation.component";
import { MatDialog } from "@angular/material";
@Component({
  selector: "app-bom",
  templateUrl: "./bom.component.html",
  styleUrls: ["../../../assets/scss/pages/bom.scss"]
})
export class BomComponent implements OnInit {
  Object = Object;
  showTable = false;
  categories: FormControl;
  selectedCategory = [];
  value = "";
  // fullCategoryList = {
  //   "0": {
  //     label: "category",
  //     estimatedQty: null,
  //     subcategory: {
  //       label: "subCategoryName",
  //       estimatedQty: null,
  //       material: [
  //         {
  //           label: "material1",
  //           estryqty: null
  //         },
  //         {
  //           label: "material1",
  //           estryqty: null
  //         }
  //       ]
  //     }
  //   },
  //   "1": {
  //     label: "category",
  //     estimatedQty: null,
  //     subcategory: {
  //       label: "subCategoryName",
  //       estimatedQty: null,
  //       material: [
  //         {
  //           label: "material1",
  //           estryqty: null
  //         },
  //         {
  //           label: "material1",
  //           estryqty: null
  //         }
  //       ]
  //     }
  //   }
  // };

  projectId: number;
  searchText: string = null;
  product: ProjectDetails;
  fullCategoryList: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private projectService: ProjectService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.categories = new FormControl([]);
    this.fullCategoryList = this.activatedRoute.snapshot.data.bomCategory;
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params["id"];
    });
    this.getProject(this.projectId);
  }

  demo() {
    this.selectedCategory = [...this.categories.value];
    console.log(this.selectedCategory);
    //console.log(this.categories.value);
  }
  getProject(id: number) {
    this.projectService.getProject(1, id).then(data => {
      this.product = data.data;
    });
  }

  finalisedCategory() {
    this.showTable = true;
    //console.log(this.showTable);
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
