import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren
} from "@angular/core";
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
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
import { GlobalLoaderService } from 'src/app/shared/services/global-loader.service';
import { GuidedTourService, Orientation, GuidedTour } from 'ngx-guided-tour';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { orgTrades } from 'src/app/shared/models/trades';
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
  searchDataValues: categoryNestedLevel;
  form: FormGroup;
  tradeNames: string[] = []
  tradesList: orgTrades[];
  searchMaterial: string;
  public BomDashboardTour: GuidedTour = {
    tourId: 'bom-tour',
    useOrb: false,

    steps: [
      {
        title: 'Choose Option',
        selector: '.material-select-options',
        content: 'Choose from material groups to add materials in the Bill of materials from your project.',
        orientation: Orientation.Right
      },
      {
        title: 'Download Excel Template',
        selector: '.download-bom-template',
        content: 'Download excel template to upload materials in your project .',
        orientation: Orientation.Left

      }
    ]
  };

  public BomDashboardTourSecond: GuidedTour = {
    tourId: 'bom-second-tour',
    useOrb: false,

    steps: [
      {
        title: 'Save Button',
        selector: '.save-material-button',
        content: 'Enter the quantity against the materials and add in BOM.',
        orientation: Orientation.Left
      }
    ]
  };

  constructor(
    private fomBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private router: Router,
    private bomService: BomService,
    private userService: UserService,
    private loading: GlobalLoaderService,
    private guidedTourService: GuidedTourService
  ) {
    setTimeout(() => {
      this.guidedTourService.startTour(this.BomDashboardTour);
    }, 1000);
  }

  ngOnInit() {
    this.categories = new FormControl([]);
    this.fullCategoryList = this.activatedRoute.snapshot.data.bomCategory;
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params["id"];
    });
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.getProject(this.projectId);
    this.formInit()
    this.bomService.getOrgTrades(this.projectId).then(res => {
      this.tradesList = res.data as orgTrades[];
      const selectedTrades = this.tradesList.filter((trade: orgTrades) => {
        return trade.isAttatched
      })
      this.form.get('selectedTrades').setValue(selectedTrades)
      this.choosenTrade()
    })
    // this.bomService
    //   .getMaterialWithQuantity(this.orgId, this.projectId)
    //   .then(res => {
    //     this.categoryList = [
    //       ...new Set(res.data.map(cat => cat.materialGroup))
    //     ] as string[];
    //     this.fullCategoryList.forEach(category => {
    //       category.checked =
    //         this.categoryList.indexOf(category.materialGroup) != -1;
    //     });
    //     this.selectedCategory = this.fullCategoryList.filter(
    //       opt => opt.checked
    //     );
    //   });

  }

  formInit() {
    this.form = this.fomBuilder.group({
      selectedTrades: ['']
    })
  }
  getProject(id: number) {
    this.projectService.getProject(this.orgId, id).then(data => {
      this.product = data.data;
    });
  }
  uploadExcel(files: FileList) {
    this.loading.show();
    const data = new FormData();
    data.append("file", files[0]);
    this.bomService.postMaterialExcel(data, this.projectId).then(res => {
      this.router.navigate(["/bom/" + this.projectId + "/bom-detail"]);
      this.loading.hide();
    });
  }
  downloadExcel(url: string) {
    var win = window.open(url, "_blank");
    win.focus();
  }

  choosenTrade() {
    let tradeAdd: string[] = [];
    let tradeRemove: string[] = [];
    const selectedTrades = this.form.value.selectedTrades.map(
      selectedTrade => selectedTrade.tradeName
    );
    // if (selectedTrades.length === 0) {
    //   this.categoryData = [];
    //   this.tradeNames = [];
    //   return;
    // }
    // if (this.tradeNames.length === 0) {
    //   tradeAdd = selectedTrades;
    // } else if (this.tradeNames.length < selectedTrades.length) {
    //   for (let id of selectedTrades) {
    //     if (!this.tradeNames.includes(id)) {
    //       tradeAdd.push(id);
    //     }
    //   }
    // } else if (this.tradeNames.length >= selectedTrades.length) {
    //   for (let id of this.tradeNames) {
    //     if (!selectedTrades.includes(id)) {
    //       tradeRemove.push(id);
    //     }
    //   }
    //   this.categoryData = this.categoryData.filter(
    //     (category: categoryNestedLevel) => {
    //       return !tradeRemove.includes(category.tradeName);
    //     }
    //   );
    // }
    // if (tradeAdd.length) {

    this.bomService.getTrades({ tradeNames: [...selectedTrades] }).then(res => {
      this.categoryData = [...res];
      this.showTable = true;
      // this.categoryData = this.categoryData.map(
      //   (project: categoryNestedLevel) => {
      //     let proj = this.getCheckedMaterial(project);
      //     return proj;
      //   }
      // );
      // this.materialAdded();
    });
    // }
    this.tradeNames = [...selectedTrades];
  }

  finalisedCategory() {
    this.showTable = true;
    // setTimeout(() => {
    //   this.guidedTourService.startTour(this.BomDashboardTourSecond);
    // }, 1000);

    this.bomService
      .getMaterialsWithSpecs({
        pid: this.form.value.selectedTrades.map(
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
    const tradeData = {
      projectId: Number(this.projectId),
      tradelist: [...this.form.value.selectedTrades]
    }
    this.bomService.setProjTrades(tradeData);
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
    if (this.form.value.selectedTrades) return this.form.value.selectedTrades.length;
  }

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
  searchData(event) {
    this.searchDataValues = event;
  }
}
