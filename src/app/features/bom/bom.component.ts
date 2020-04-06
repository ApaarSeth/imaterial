import {
  Component,
  OnInit,
  ViewChild,
  QueryList,
  ViewChildren,
  ElementRef
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
import { BomTopMaterialComponent } from "./bom-topMaterial/bom-topMaterial.component";
import {
  categoryLevel,
  categoryNestedLevel
} from "src/app/shared/models/category";
import { QtyData } from "src/app/shared/models/subcategory-materials";
import { GlobalLoaderService } from 'src/app/shared/services/global-loader.service';
import { GuidedTourService, Orientation, GuidedTour } from 'ngx-guided-tour';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { orgTrades } from 'src/app/shared/models/trades';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { FacebookPixelService } from 'src/app/shared/services/fb-pixel.service';
import { AddBomWarningComponent } from 'src/app/shared/dialogs/add-bom-warning/add-bom-warning.component';
import { BOMAllMaterialComponent } from './bom-allMaterial/bom-allMaterial.component';
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
  topMaterialData: categoryNestedLevel[] = [];
  allMaterialData: categoryNestedLevel[] = [];
  value = "";
  projectId: number;
  searchText: string = null;
  product: ProjectDetails;
  fullCategoryList: categoryLevel[];
  selectedCategory: categoryLevel[] = [];
  @ViewChild("preview", { static: false }) topMaterial: BomTopMaterialComponent;
  @ViewChild("preview1", { static: false }) allMaterial: BOMAllMaterialComponent;
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
  currentIndex: number = null;
  previousIndex: number = null;
  searchTrade: string = "";
  buttonName: number = 0;
  searchAgain: string;
  valueChanged: boolean = false;
  valueChangedAll: boolean = false;
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
    private globalLoader: GlobalLoaderService
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
    })
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
    this.selectedTrades = this.form.value.selectedTrades.map(
      selectedTrade => selectedTrade.tradeName
    );
    this.callApi();
    {// if (selectedTrades.length === 0) {
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

    }

    this.tradeNames = [...this.selectedTrades];
  }

  callApi() {
    if (this.buttonName === 0) {
      if (this.selectedTrades.length) {
        this.bomService.get25Trades({ tradeNames: [...this.selectedTrades] }).then(res => {
          this.topMaterialData = [...res];
          this.searchAgain = this.text.nativeElement.value
          this.showTable = true;
        });
      }
      else {
        this.showTable = false;
      }
    }
    else {
      if (this.selectedTrades.length) {
        this.bomService.getTrades({ tradeNames: [...this.selectedTrades] }).then(res => {
          this.allMaterialData = [...res];
          this.searchAgain = this.text.nativeElement.value
          this.showTable = true;
        });
      }
      else {
        this.showTable = false;
      }
    }
  }

  setButtonName(name: string) {
    // this.globalLoader.show();
    // let dataPresent: boolean;
    // if (this.buttonName === "25Material") {
    //   dataPresent = this.topMaterial ? (<QtyData[]>this.topMaterial.getData()).some(data => {
    //     return data.estimatedQty > 0
    //   }) : false;
    // }
    // else {
    //   dataPresent = this.allMaterial ? (<QtyData[]>this.allMaterial.getData()).some(data => {
    //     return data.estimatedQty > 0
    //   }) : false;
    // }
    // if (dataPresent) {
    //   this.openAddBomDialog(name);
    // } else {
    //   this.buttonName = name;
    //   this.callApi()
    // }
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
      this.openAddBomDialog(event.index);
    } else {
      this.buttonName = event.index;
      this.valueChanged = false;
      this.valueChangedAll = false;
      this.callApi()
    }
  }

  openAddBomDialog(index: number) {
    const dialogRef = this.dialog.open(AddBomWarningComponent, {
      width: "400px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveCategory();
      }
      else {
        this.buttonName = index;
        this.callApi();
      }
    })
  }


  // finalisedCategory() {
  //   this.showTable = true;

  //   this.bomService
  //     .getMaterialsWithSpecs({
  //       pid: this.form.value.selectedTrades.map(
  //         selectedCategory => selectedCategory.materialGroup
  //       )
  //     })
  //     .then(res => {
  //       this.topMaterialData = [...res];
  //     });
  // }

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
    else {
      this.categoriesInputData =
        this.allMaterial.getData();
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
