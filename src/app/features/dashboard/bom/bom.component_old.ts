import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  ElementRef,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { FormControl, FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { BomTopMaterialComponent } from "./bom-topMaterial/bom-topMaterial.component";
import { categoryNestedLevel, categoryLevel } from "../../../shared/models/category";
import { ProjectDetails, ProjetPopupData } from "../../../shared/models/project-details";
import { BOMAllMaterialComponent } from "./bom-allMaterial/bom-allMaterial.component";
import { BomMyMaterialComponent } from "./bom-myMaterial/bom-myMaterial.component";
import { QtyData } from "../../../shared/models/subcategory-materials";
import { orgTrades } from "../../../shared/models/trades";
import { GuidedTour, Orientation, GuidedTourService } from "ngx-guided-tour";
import { ProjectService } from "../../../shared/services/project.service";
import { MatDialog } from "@angular/material/dialog";
import { BomService } from "../../../shared/services/bom.service";
import { UserService } from "../../../shared/services/user.service";
import { GlobalLoaderService } from "../../../shared/services/global-loader.service";
import { UserGuideService } from "../../../shared/services/user-guide.service";
import { AppNavigationService } from "../../../shared/services/navigation.service";
import { FacebookPixelService } from "../../../shared/services/fb-pixel.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CommonService } from "../../../shared/services/commonService";
import { SnackbarComponent } from "../../../shared/dialogs/snackbar/snackbar.compnent";
import { AddMyMaterialBomComponent } from "../../../shared/dialogs/add-my-material-Bom/add-my-material-bom.component";
import { AddBomWarningComponent } from "../../../shared/dialogs/add-bom-warning/add-bom-warning.component";
import { AddProjectComponent } from "../../../shared/dialogs/add-project/add-project.component";
import { DoubleConfirmationComponent } from "../../../shared/dialogs/double-confirmation/double-confirmation.component";

@Component({
  selector: "app-bom",
  templateUrl: "./bom.component.html"
})
export class BomComponent implements OnInit {
  Object = Object;
  showTable = false;
  categories: FormControl;
  categoryList: string[] = [];
  topMaterialData: categoryNestedLevel[] = [];
  allMaterialData: categoryNestedLevel[] = [];
  myMaterialData: categoryNestedLevel[] = [];
  value = "";
  projectId: number;
  searchText: string = null;
  product: ProjectDetails;
  fullCategoryList: categoryLevel[];
  selectedCategory: categoryLevel[] = [];
  @ViewChild("preview", { static: false }) topMaterial: BomTopMaterialComponent;
  @ViewChild("preview1", { static: false }) allMaterial: BOMAllMaterialComponent;
  @ViewChild("preview2", { static: false }) myMaterial: BomMyMaterialComponent;
  @ViewChild("text", { static: false }) text: ElementRef;
  selectedTrades: string[];
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
  currentIndex: number = 0;
  previousIndex: number = null;
  searchTrade: string = "";
  buttonName: number = 0;
  searchAgain: string;
  valueChanged: boolean = false;
  valueChangedAll: boolean = false;
  showTopMaterial: boolean = true;
  showAllMaterial: boolean = true;
  showMyMaterial: boolean = true;
  innerWidth: number;

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
    ],
    skipCallback: () => {
      this.setLocalStorage()
    },
    completeCallback: () => {
      this.setLocalStorage()
    }
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
    private guidedTourService: GuidedTourService,
    private userGuideService: UserGuideService,
    private navService: AppNavigationService,
    private fbPixel: FacebookPixelService,
    private globalLoader: GlobalLoaderService,
    private _snackBar: MatSnackBar,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
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
      this.tradesList = (<orgTrades[]>res.data).filter((trade: orgTrades) => {
        return trade.tradeName !== 'General Contractor' && trade.tradeName !== 'Others'
      });

      const selectedTrades = this.tradesList.filter((trade: orgTrades) => {
        return trade.isAttatched
      })
      this.form.get('selectedTrades').setValue(selectedTrades)
      this.choosenTrade()
    });

    this.onResize(event);
  }

  /**
   * @description to check the width of screen
   * @param event 
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  setLocalStorage() {
    const popovers = {
      "userId": this.userId,
      "moduleName": "addBom",
      "enableGuide": 1
    };
    this.userGuideService.sendUserGuideFlag(popovers).then(res => {
      if (res) {
        localStorage.setItem('addBom', '1');
      }
    })
  }

  searchMaterial(event) {
    this.bomService.searchText.next(event);
  }

  formInit() {
    this.form = this.fomBuilder.group({
      selectedTrades: ['']
    })
  }
  getProject(id: number) {
    this.projectService.getProject(this.orgId, id).then(data => {
      this.product = data.data;
      if ((localStorage.getItem('addBom') == "null") || (localStorage.getItem('addBom') == '0')) {
        setTimeout(() => {
          this.guidedTourService.startTour(this.BomDashboardTour);
        }, 1000);
      }
    });
  }
  uploadExcel(files: FileList) {
    const data = new FormData();
    data.append("file", files[0]);
    var fileSize = files[0].size; // in bytes
    if (fileSize < 5000000) {
      this.postMaterialExcel(data);
    }
    else {
      this._snackBar.open("File must be less than 5 mb", "", {
        duration: 2000,
        panelClass: ["success-snackbar"],
        verticalPosition: "bottom"
      });
    }
  }

  postMaterialExcel(data) {
    this.loading.show();
    this.bomService.postMaterialExcel(data, this.projectId).then(res => {
      this.router.navigate(["project-dashboard/bom/" + this.projectId + "/bom-detail"]);
      this.loading.hide();
      if (res.statusCode === 201) {
        this._snackBar.openFromComponent(SnackbarComponent, {
          data: res.data,
          duration: 6000,
          panelClass: ["success-snackbar"],
          verticalPosition: "bottom"
        });
      } else {
        this._snackBar.open(res.message, "", {
          duration: 2000,
          panelClass: ["success-snackbar"],
          verticalPosition: "bottom"
        });
      }
    });
  }
  downloadExcel(url: string) {
    var win = window.open(url, "_blank");
    win.focus();
  }

  choosenTrade() {
    let tradeAdd: string[] = [];
    let tradeRemove: string[] = [];
    this.selectedTrades = this.form.value.selectedTrades.map(
      selectedTrade => selectedTrade.tradeName
    );
    this.callApi();

    this.tradeNames = [...this.selectedTrades];
  }

  callApi() {
    if (this.buttonName === 0) {
      this.showAllMaterial = false;
      this.showMyMaterial = false;
      this.showTopMaterial = true;
      this.bomService.get25Trades({ tradeNames: this.selectedTrades.length ? [...this.selectedTrades] : null }).then(res => {
        this.topMaterialData = [...res];
        this.showTable = true;
      });
    }
    else if (this.buttonName == 1) {
      this.showTopMaterial = false;
      this.showMyMaterial = false;
      this.showAllMaterial = true;
      this.bomService.getTrades({ tradeNames: this.selectedTrades.length ? [...this.selectedTrades] : null }).then(res => {
        this.allMaterialData = [...res];
      });
    }
    else if (this.buttonName == 2) {
      this.showAllMaterial = false;
      this.showTopMaterial = false;
      this.showMyMaterial = true;
      this.commonService.getMyMaterial('allwithdeleted').then(res => {
        this.myMaterialData = [...res.data];
      });
    }
  }

  tabClick(event) {
    this.text.nativeElement.value = ""
    this.previousIndex = this.currentIndex ? this.currentIndex : 0;
    this.currentIndex = event.index;
    let dataPresent: boolean;
    if (this.previousIndex === 0) {
      dataPresent = this.valueChanged;
    }
    else {
      dataPresent = this.valueChangedAll;
    }
    if (dataPresent) {
      this.valueChanged = false;
      this.valueChangedAll = false;
      if (this.currentIndex === 0)
        this.showTopMaterial === false
      else if (this.currentIndex == 1) {
        this.showAllMaterial === false
      }
      else if (this.currentIndex == 2) {
        this.showMyMaterial === false
      }
      this.openAddBomDialog(event.index);
    } else {
      this.buttonName = this.currentIndex;
      this.valueChanged = false;
      this.valueChangedAll = false;
      this.callApi()
    }
  }

  openAddMyMaterial() {
    let data = this.projectId
    const dialogRef = this.dialog.open(AddMyMaterialBomComponent, {
      width: "1400px",
      data,
      panelClass: 'add-custom-material'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        this.getProject(this.projectId);
        this.callApi()
      }
    })
  }

  openAddBomDialog(index: number) {
    const dialogRef = this.dialog.open(AddBomWarningComponent, {
      width: "400px",
      backdropClass: 'backdropBackground'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.previousIndex === 0 ? this.showTopMaterial === true : this.previousIndex === 1 ? this.showAllMaterial === true : this.showMyMaterial === true;
        this.saveCategory();
      }
      else {
        if (this.currentIndex === 0)
          this.showTopMaterial === true
        else if (this.currentIndex == 1) {
          this.showAllMaterial === true
        }
        else if (this.currentIndex == 2) {
          this.showMyMaterial === true
        }
        // index === 0 ? this.showTopMaterial === true : (index === 1 ? this.showAllMaterial === true : this.showMyMaterial === true);
        this.buttonName = index;
        this.callApi();
      }
    })
  }

  checkValidations(event: boolean): void {
    this.valueChanged = event
  }


  checkValidationsAll(event: boolean): void {
    this.valueChangedAll = event
  }

  saveCategory() {
    if (this.buttonName === 0) {
      this.categoriesInputData =
        this.topMaterial.getData();
    }
    else if (this.buttonName === 1) {
      this.categoriesInputData =
        this.allMaterial.getData();
    }
    else if (this.buttonName === 2) {
      this.categoriesInputData =
        this.myMaterial.getData();
    }

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
        this.fbPixel.fire('AddToCart');
        this.navService.gaEvent({
          action: 'submit',
          category: 'material_added',
          label: 'material name',
          value: null
        });
        this.router.navigate(["project-dashboard/bom/" + this.projectId + "/bom-detail"]);
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
        data,
        panelClass: 'add-project-dialog'
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

  get formArray() {
    return <FormArray>this.form.get('selectedTrades').value;
  }
}
