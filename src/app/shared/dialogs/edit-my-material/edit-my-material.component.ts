import { MyMaterialPost } from './../../models/myMaterial';
import { MyMaterialService } from './../../services/myMaterial.service';
import { Component, OnInit, Inject } from "@angular/core";
import { UserRoles, UserDetails } from "../../models/user-details";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { tradeRelatedCategory } from "../../models/trades";
import { UserService } from "../../services/user.service";
import { BomService } from "../../services/bom.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { material } from '../../models/category';

@Component({
  selector: 'app-edit-my-material',
  templateUrl: './edit-my-material.component.html'
})

export class EditMyMaterialComponent implements OnInit {

  searchUnit: string = '';
  searchCategory: string = "";
  roles: UserRoles;
  addMyMaterial: FormGroup;
  users: UserDetails;
  rows: FormArray;
  emailVerified: boolean = true;
  emailMessage: string;
  creatorId: number;
  index: string[] = [];
  emails: string[] = [];
  count: any;
  addUserFormLength: number;
  check: boolean;
  materialUnit: string[];
  tradesList: { tradeName: string, tradeId: number }[] = [];
  filteredOption: tradeRelatedCategory[] = [];
  addOtherFormGroup: FormGroup;
  editMaterialForm: FormGroup;

  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private bomService: BomService,
    private myMaterialService: MyMaterialService,
    private dialogRef: MatDialogRef<EditMyMaterialComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { materialList: material[], type: string }) { }

  ngOnInit() {
    this.creatorId = Number(localStorage.getItem("userId"));
    this.formInit();
    this.getUserData(this.creatorId);
    this.getUserRoles();
    this.getMaterialUnit();
  }

  getTrades() {
    this.userService.getTrades().then(res => {
      this.tradesList = res.data;
      (<FormArray>this.editMaterialForm.get('forms')).controls.map((control: FormGroup, i) => {
        control.controls['trade'].setValue(
          this.tradesList.find(trade => trade.tradeId === this.data.materialList[i].tradeId))
      });
    })
  }

  getCategories() {
    this.bomService.getAllCategories().then(res => {
      this.filteredOption = res.data;
      this.filteredOption.push({ categoriesCode: null, categoriesName: 'Others' });
      (<FormGroup>(<FormArray>this.editMaterialForm.get('forms')).controls[0]).controls['category'].setValue(
        { categoriesCode: this.data.materialList[0].materialGroupCode, categoriesName: this.data.materialList[0].materialGroup })
    })
  }

  getMaterialUnit() {
    this.bomService.getMaterialUnit().then(res => {
      this.materialUnit = res.data;
    });
  }

  getUserRoles() {
    this._userService.getRoles().then(res => {
      this.roles = res.data;
    });
  }

  getUserData(userId) {
    this._userService.getUserInfo(userId).then(res => {
      if (res.data.roleName) {
        localStorage.setItem("role", res.data.roleName);
      }
    });
  }

  formInit() {
    const addOtherFormGroup = this.data.materialList.map((data: material) => {
      let frmGrp = this._formBuilder.group({
        customMaterialId: data.customMaterialId,
        materialName: [data.materialName, [Validators.required, Validators.maxLength(300)]],
        materialUnit: [data.materialUnit, Validators.required],
        index: [],
        trade: [{ value: data.tradeName, disabled: true }],
        category: [{ value: data.materialGroup, disabled: true }]
      });
      return frmGrp;
    });
    this.editMaterialForm = this._formBuilder.group({});
    this.editMaterialForm.addControl('forms', new FormArray(addOtherFormGroup));
    // (<FormArray>this.editMaterialForm.get('forms')).controls.map((control: FormGroup, i) => {
    //   control.controls['trade'].valueChanges.subscribe(changes => {
    //     if (changes) {
    //       this.bomService.getTradeCategory(changes.tradeName).then(res => {
    //         // control.controls['category'].reset();
    //         this.filteredOption[i] = [...res.data];
    //         this.filterOptions = new Observable((observer) => {
    //           const val: tradeRelatedCategory[] | [string] = this._filter('', i);
    //           // observable execution
    //           observer.next(val);
    //           observer.complete();
    //         });
    //       });
    //     }
    //   })
    //   control.controls['category'].valueChanges.subscribe(changes => {
    //     this.filterOptions = null;
    //     this.filterOptions = new Observable((observer) => {
    //       const val: tradeRelatedCategory[] | [string] = this._filter(changes, i);
    //       observer.next(val);
    //       observer.complete();
    //     });
    //   })
    // })
  }

  // private _filter(value: string | tradeRelatedCategory, index) {
  //   if (value || value === "") {
  //     const filterValue = typeof (value) === "string" ? value.toLowerCase() : value.categoriesName.toLowerCase();
  //     if (filterValue === '') {
  //       return this.filteredOption[index];
  //     }
  //     let filteredValue: tradeRelatedCategory[] | [string] = !this.filteredOption[index] ? [] : this.filteredOption[index].filter(option => option.categoriesName.toLowerCase().includes(filterValue));
  //     if (!filteredValue.length) {
  //       filteredValue = [{ categoriesName: filterValue + " (new value)", categoriesCode: null }];
  //     }
  //     return filteredValue;
  //   }
  // }

  get currentData() {
    let currentIndex = this.addMyMaterial.get('myMaterial')['controls'].length - 1;
    let { trade, materialName, category } = (<FormArray>this.addMyMaterial.get('myMaterial')).controls[currentIndex].value;
    trade = !trade ? "" : trade.tradeName;
    category = !category ? "" : category.categoryName;
    return { trade, category, materialName };
  }

  displayFn(option: tradeRelatedCategory) {
    return option && option.categoriesName ? option.categoriesName : '';
  }

  displayFn1(trade) {
    return trade && trade.tradeName ? trade.tradeName : '';
  }

  onDelete(i) {}

  get currentIndex() {
    return this.addMyMaterial.get('myMaterial')['controls'].length - 1;
  }

  submit() {
    let myMaterial: MyMaterialPost = (this.editMaterialForm.get("forms") as FormArray).getRawValue().map(val => {
      return {
        customMaterialId: val.customMaterialId,
        estimatedPrice: null,
        estimatedQty: null,
        materialName: val.materialName,
        materialGroupCode: typeof (val.category) === 'string' ? null : val.category.categoriesCode,
        materialGroup: typeof (val.category) === 'string' ? val.category : val.category.categoriesName,
        materialUnit: val.materialUnit,
        tradeId: val.trade.tradeId,
        tradeName: val.trade.tradeName
      };
    }) as any;

    if (this.data.type === 'edit') {
      if (this.data.materialList[0].materialName === myMaterial[0].materialName) {
        this.editMaterial(myMaterial)
      }
      else {
        this.checkMaterialExist(myMaterial)
      }
    }
    else {
      let tradeChange = this.data.materialList[0].tradeId !== myMaterial[0].tradeId;
      let categoryChange = this.data.materialList[0].materialGroup !== myMaterial[0].materialGroup;
      let materialNameChange = this.data.materialList[0].materialName !== myMaterial[0].materialName;
      if (materialNameChange) {
        myMaterial.isAllChange = tradeChange || categoryChange;
        myMaterial.isNameChange = true;
        this.checkMaterialExist(myMaterial)
      }
      else {
        myMaterial[0].isAllChange = tradeChange || categoryChange;
        myMaterial[0].isNameChange = true;
        this.addMaterial(myMaterial);
      }
    }
  }

  checkMaterialExist(myMaterial: MyMaterialPost) {
    let checkData = { tradeName: myMaterial.tradeName, materialName: myMaterial.materialName, categoryName: myMaterial.materialGroup }
    this.bomService.getMaterialExist(checkData).then(res => {
      if (res.data) {
        this.data.type === 'edit' ? this.editMaterial(myMaterial) : this.addMaterial(myMaterial)
      }
      else {
        this.resetMaterialName("Set New Material Name")
      }
      this.dialogRef.close(null);
    });
  }

  resetMaterialName(message) {
    this._snackBar.open(message, "", {
      duration: 4000,
      panelClass: ["warning-snackbar"],
      verticalPosition: "bottom"
    });
    (<FormGroup>(<FormArray>this.editMaterialForm.get("forms")).controls[0]).controls['materialName'].reset()
  }

  editMaterial(myMaterial: MyMaterialPost) {
    let updateMaterial = { materialName: myMaterial[0].materialName, materialUnit: myMaterial[0].materialUnit, customMaterialId: myMaterial[0].customMaterialId }
    this.myMaterialService.updateMyMaterial(updateMaterial).then(res => {
      if (res.message = "done") {
        this.dialogRef.close('done');
      }
    });
  }

  addMaterial(myMaterial) {
    let updateMaterial = {
      tradeId: myMaterial[0].tradeId,
      tradeName: myMaterial[0].tradeName, isAllChange: myMaterial[0].isAllChange, isNameChange: myMaterial[0].isNameChange, materialGroup: myMaterial[0].materialGroup, materialGroupCode: myMaterial[0].materialGroupCode, materialName: myMaterial[0].materialName, materialUnit: myMaterial[0].materialUnit, customMaterialId: myMaterial[0].customMaterialId
    }
    this.myMaterialService.approveMyMaterial([updateMaterial]).then(res => {
      if (res.message = "done") {
        this.resetMaterialName("Materials Approved")
      }
      this.dialogRef.close('done');
    });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}