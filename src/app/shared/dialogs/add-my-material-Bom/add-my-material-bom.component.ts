import { Component, OnInit, Inject } from "@angular/core"; import { UserRoles, UserDetails } from "../../models/user-details"; import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms"; import { orgTrades, tradeRelatedCategory } from "../../models/trades"; import { UserService } from "../../services/user.service"; import { BomService } from "../../services/bom.service"; import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"; import { MatSnackBar } from "@angular/material/snack-bar";

export interface City {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-my-material-bom',
  templateUrl: './add-my-material-bom.component.html'
})

export class AddMyMaterialBomComponent implements OnInit {
  searchCategory: string = ""
  roles: UserRoles;
  addMyMaterial: FormGroup;
  users: UserDetails;
  rows: FormArray;
  emailVerified: boolean = true;
  emailMessage: string;
  searchTrade: string = "";
  creatorId: number;
  index: string[] = [];
  emails: string[] = [];
  count: any;
  addUserFormLength: number;
  check: boolean;
  materialUnit: string[]
  tradesList: orgTrades[] = [];
  filteredOption: tradeRelatedCategory[] = [];
  searchUnit: string = '';
  // filterOptions: Observable<tradeRelatedCategory[] | [string]>;
  firefox: boolean;

  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private bomService: BomService,
    private dialogRef: MatDialogRef<AddMyMaterialBomComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data) { }
  currencyCode: String
  ngOnInit() {
    this.currencyCode = localStorage.getItem('currencyCode')
    this.creatorId = Number(localStorage.getItem("userId"));
    this.getUserData(this.creatorId);
    this.getCategories();
    this.getUserRoles();
    this.getMaterialUnit();
    this.getTrades();
    this.getBrowser();
    this.formInit();
  }

  getBrowser() {
    if (window.navigator.userAgent.indexOf('Mozilla') != -1) {
      this.firefox = true;
    }
    else {
      this.firefox = false;
    }
  }

  getCategories() {
    this.bomService.getAllCategories().then(res => {
      this.filteredOption = res && res.data;
      this.filteredOption.push({ categoriesCode: null, categoriesName: 'Others' })
    })
  }

  getTrades() {
    this.bomService.getOrgTrades(this.data).then(res => {
      this.tradesList = res.data as orgTrades[]
    })
  }


  getMaterialUnit() {
    this.bomService.getMaterialUnit().then(res => {
      this.materialUnit = res.data;
    });
  }
  /**
   * @description Get all user roles
   */
  getUserRoles() {
    this._userService.getRoles().then(res => {
      this.roles = res.data;
    })
  }



  getUserData(userId) {
    this._userService.getUserInfo(userId).then(res => {
      if (res.data.roleName) {
        localStorage.setItem("role", res.data.roleName);
      }
    });
  }

  formInit() {
    this.addMyMaterial = this._formBuilder.group({
      myMaterial: this._formBuilder.array([])
    });
    (<FormArray>this.addMyMaterial.get("myMaterial")).push(this.addOtherFormGroup());
  }

  addOtherFormGroup(): FormGroup {

    const formGrp = this._formBuilder.group({
      materialName: ['', [Validators.required, Validators.maxLength(300)]],
      materialUnit: ['', Validators.required],
      index: [],
      estimatedQty: ['', this.data ? Validators.required : null],
      estimatedPrice: [''],
      trade: ['', Validators.required],
      category: ['', Validators.required],
    });

    formGrp.get("index").patchValue(this.addMyMaterial.get('myMaterial')['controls'].length)
    return formGrp;
  }


  get currentData() {
    let currentIndex = this.addMyMaterial.get('myMaterial')['controls'].length - 1;
    let { trade, materialName, category } = (<FormArray>this.addMyMaterial.get('myMaterial')).controls[currentIndex].value;
    trade = !trade ? "" : trade.tradeName;
    category = !category ? "" : category.categoryName;
    return { trade, category, materialName }
  }

  async checkMaterialExist(): Promise<{ notUsedBefore: string, notPresentInDb: string }> {
    let checkData = { tradeName: this.currentData.trade, materialName: this.currentData.materialName, categoryName: this.currentData.category }
    const res = await this.bomService.getMaterialExist(checkData);
    let val;
    if (res.data) {
      let currentMaterialName = (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).value['materialName'];
      let alreadyPresent = this.currentIndex == 0 ? false : (this.addMyMaterial.get("myMaterial").value.some((val_1, i) => {
        return (i !== this.currentIndex && val_1.materialName === currentMaterialName);
      }));
      if (!alreadyPresent) {
        val = { notUsedBefore: true, notPresentInDb: true };
      }
      else {
        val = { notUsedBefore: false, notPresentInDb: true };
      }
    }
    else {
      val = { notUsedBefore: null, notPresentInDb: false };
    }
    return val;

  }

  resetMaterialName(message) {
    this._snackBar.open(message, "", {
      duration: 4000,
      panelClass: ["warning-snackbar"],
      verticalPosition: "bottom"
    });
    (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).controls['materialName'].reset();

  }

  onAddRow() {
    this.checkMaterialExist().then(check => {
      if (check.notPresentInDb) {
        if (check.notUsedBefore)
          (<FormArray>this.addMyMaterial.get('myMaterial')).push(this.addOtherFormGroup());
        else {
          this.resetMaterialName("Set New Material Name");
        }
      }
      else {
        this.resetMaterialName("Material Name already exist in all material");
      }
    });


  }
  onDelete(index) {
    (<FormArray>this.addMyMaterial.get('myMaterial')).removeAt(index);
  }

  displayFn(option: tradeRelatedCategory) {
    return option && option.categoriesName ? option.categoriesName : ''
  }


  get currentIndex() {
    return this.addMyMaterial.get('myMaterial')['controls'].length - 1;
  }

  submit() {
    this.checkMaterialExist().then(check => {
      if (check.notPresentInDb) {
        if (check.notUsedBefore) {
          let myMaterial = this.addMyMaterial.get("myMaterial").value.map(val => {
            return {
              estimatedPrice: this.data ? Number(val.estimatedPrice) : null,
              estimatedQty: this.data ? Number(val.estimatedQty) : null,
              materialName: val.materialName,
              materialGroupCode: val.category.categoriesCode,
              materialGroup: val.category.categoriesName,
              materialUnit: val.materialUnit,
              tradeId: val.trade.tradeId
            }
          })
          this.bomService.addMyMaterial(this.data, myMaterial).then(res => {
            if (res.message = "done") {
              this._snackBar.open('Materials Added in BOM successfully', "", {
                duration: 4000,
                panelClass: ["warning-snackbar"],
                verticalPosition: "bottom"
              });
            }
            this.dialogRef.close('done');
          });
        }
        else {
          this.resetMaterialName("Set New Material Name");
        }
      }
      else {
        this.resetMaterialName("Material Name already exist in all material");
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}