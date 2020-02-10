import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { ProjectService } from "src/app/shared/services/projectDashboard/project.service";
import {
  ProjectDetails,
  ProjetPopupData
} from "src/app/shared/models/project-details";
import { AddProjectComponent } from "src/app/shared/dialogs/add-project/add-project.component";
import { DoubleConfirmationComponent } from "src/app/shared/dialogs/double-confirmation/double-confirmation.component";
import { MatDialog } from "@angular/material";
import { BomService } from "src/app/shared/services/bom/bom.service";
import { BomPreviewComponent } from "./bom-preview/bom-preview.component";
import {
  categoryLevel,
  categoryNestedLevel
} from "src/app/shared/models/category";
import { QtyData } from "src/app/shared/models/subcategory-materials";
@Component({
  selector: "app-bom",
  templateUrl: "./bom.component.html",
  styleUrls: ["../../../assets/scss/main.scss"]
})
export class BomComponent implements OnInit {
  Object = Object;
  showTable = false;
  categories: FormControl;
  categoryList: string[] = [];
  categoryData: categoryNestedLevel[] = [];
  value = "";

  projectId: number;
  searchText: string = null;
  product: ProjectDetails;
  fullCategoryList: categoryLevel[];
  selectedCategory: categoryLevel[] = [];
  @ViewChildren("preview") previews: QueryList<BomPreviewComponent>;
  categoriesInputData: QtyData[];
  quantityPresent: boolean = true;
  isAllFormsValid: boolean;
  fileToUpload: FileList;
  orgId: number;
  userId: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private router: Router,
    private bomService: BomService
  ) {}

  ngOnInit() {
    this.categories = new FormControl([]);
    this.fullCategoryList = this.activatedRoute.snapshot.data.bomCategory;
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params["id"];
    });
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.getProject(this.projectId);
    this.bomService
      .getMaterialWithQuantity(this.orgId, this.projectId)
      .then(res => {
        this.categoryList = [
          ...new Set(res.data.map(cat => cat.materialGroup))
        ] as string[];
        this.fullCategoryList.forEach(category => {
          category.checked =
            this.categoryList.indexOf(category.materialGroup) != -1;
        });
        this.selectedCategory = this.fullCategoryList.filter(
          opt => opt.checked
        );
      });
  }

  getProject(id: number) {
    this.projectService.getProject(this.orgId, id).then(data => {
      this.product = data.data;
    });
  }
  uploadExcel(files: FileList) {
    const data = new FormData();
    data.append("file", files[0]);
    this.bomService.postMaterialExcel(data, this.projectId).then(res => {
      this.router.navigate(["/bom/" + this.projectId + "/bom-detail"]);
    });
  }
  downloadExcel(url: string) {
    var win = window.open(url, "_blank");
    win.focus();
  }
  finalisedCategory() {
    this.showTable = true;
    this.bomService
      .getMaterialsWithSpecs({
        pid: this.categories.value.map(
          selectedCategory => selectedCategory.materialGroup
        )
      })
      .then(res => {
        this.categoryData = [...res];
      });
  }

  checkValidations(): void {
    this.isAllFormsValid = this.previews
      .map((preview: BomPreviewComponent) => preview.quantityForms.valid)
      .every(Boolean);
  }

  saveCategory() {
    this.categoriesInputData = this.previews
      .map(preview => {
        return preview.getData();
      })
      .flat();
    for (let data of this.categoriesInputData) {
      if (data.estimatedQty > 0) {
        this.quantityPresent = false;
      }
    }
    this.bomService
      .sumbitCategory(this.userId, this.projectId, this.categoriesInputData)
      .then(res => {
        this.router.navigate(["/bom/" + this.projectId + "/bom-detail"]);
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
  clearSelectedCategory(category) {
    this.selectedCategory = this.selectedCategory.filter(
      cats => cats.materialGroup !== category.materialGroup
    );
  }
  getSelectedCategoriesLength() {
    if (this.categories.value) return this.categories.value.length;
  }

  openDialog(data: ProjetPopupData): void {
    if (data.isDelete == false) {
      const dialogRef = this.dialog.open(AddProjectComponent, {
        width: "700px",
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
}
