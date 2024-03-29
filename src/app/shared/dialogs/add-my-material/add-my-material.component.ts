import { Component, OnInit, Inject } from "@angular/core"; 
import { UserRoles, UserDetails } from "../../models/user-details"; 
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms"; 
import { orgTrades, tradeRelatedCategory } from "../../models/trades"; 
import { UserService } from "../../services/user.service"; 
import { BomService } from "../../services/bom.service"; 
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"; 
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-my-material',
  templateUrl: './add-my-material.component.html'
})

export class AddMyMaterialComponent implements OnInit {

  searchUnit: string = '';
  roles: UserRoles;
  addMyMaterial: FormGroup;
  users: UserDetails;
  rows: FormArray;
  emailVerified: boolean = true;
  emailMessage: string;
  creatorId: number;
  index: string[] = [];
  searchCategory: string = ""
  emails: string[] = [];
  count: any;
  addUserFormLength: number;
  check: boolean;
  materialUnit: string[]
  tradesList: orgTrades[] = [];
  filteredOption: tradeRelatedCategory[] = [];
  searchTrade: string = '';

  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private bomService: BomService,
    private dialogRef: MatDialogRef<AddMyMaterialComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.creatorId = Number(localStorage.getItem("userId"));
    this.getUserData(this.creatorId);
    this.getUserRoles();
    this.getMaterialUnit();
    this.getTrades();
    this.getCategories();
    this.formInit();
  }

  getCategories() {
    this.bomService.getAllCategories().then(res => {
      this.filteredOption = res.data;
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

  onKey(value) {
    this.searchCategory = value;
  }

  addOtherFormGroup(): FormGroup {
    const formGrp = this._formBuilder.group({
      materialName: ['', [Validators.required, Validators.maxLength(300)]],
      materialUnit: ['', Validators.required],
      index: [],
      trade: ['', Validators.required],
      category: ['', Validators.required],
    });

    formGrp.get("index").patchValue(this.addMyMaterial.get('myMaterial')['controls'].length)
    // formGrp.controls['category'].valueChanges.subscribe(changes => {
    //   this.filterOptions = null;
    //   this.filterOptions = new Observable((observer) => {
    //     const val: tradeRelatedCategory[] | [string] = this._filter(changes, formGrp.get("index").value)
    //     observer.next(val)
    //     observer.complete()
    //   })
    // })

    // formGrp.controls['trade'].valueChanges.subscribe(changes => {
    //   if (changes) {
    //     this.bomService.getTradeCategory(changes.tradeName).then(res => {
    //       this.filteredOption[formGrp.get("index").value] = [...res.data];
    //       this.filterOptions = new Observable((observer) => {
    //         const val: tradeRelatedCategory[] | [string] = this._filter('', formGrp.get("index").value)
    //         observer.next(val)
    //         observer.complete()
    //       })
    //     })
    //   }
    // })
    return formGrp;
  }

  // private _filter(value: string | tradeRelatedCategory, index) {
  //   if (value || value === "") {
  //     const filterValue = typeof (value) === "string" ? value.toLowerCase() : value.categoriesName.toLowerCase();
  //     if (filterValue === '') {
  //       return this.filteredOption[index];
  //     }
  //     let filteredValue: tradeRelatedCategory[] | [string] = !this.filteredOption[index] ? [] : this.filteredOption[index].filter(option => option.categoriesName.toLowerCase().includes(filterValue));
  //     if (!filteredValue.length) {
  //       filteredValue = [{ categoriesName: filterValue + " (new value)", categoriesCode: null }]
  //     }
  //     return filteredValue;
  //   }
  // }

  get currentData() {
    let currentIndex = this.addMyMaterial.get('myMaterial')['controls'].length - 1;
    let { trade, materialName, category } = (<FormArray>this.addMyMaterial.get('myMaterial')).controls[currentIndex].value;
    trade = !trade ? "" : trade.tradeName;
    category = !category ? "" : category.categoryName;
    return { trade, category, materialName }
  }

  checkMaterialExist() {
    let val;
    let checkData = { tradeName: this.currentData.trade, materialName: this.currentData.materialName, categoryName: this.currentData.category }
    return this.bomService.getMaterialExist(checkData).then(res => {
      if (res.data) {
        let currentMaterialName = (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).value['materialName'];
        let alreadyPresent = this.currentIndex == 0 ? false : (this.addMyMaterial.get("myMaterial").value.some(val => {
          return val.materialName === currentMaterialName
        }))
        if (!alreadyPresent) {
          val = { alreadyUsedBefore: false, alreadyPresentInDb: false }
        }
        else {
          val = { alreadyUsedBefore: true, alreadyPresentInDb: false }
        }
      }
      else {
        val = { alreadyUsedBefore: false, alreadyPresentInDb: true }
      }
    })
    return val
  }

  onAddRow() {
    // let check = this.checkMaterialExist();
    // if (!check.alreadyUsedBefore && !check.alreadyPresentInDb) {
    //   (<FormArray>this.addMyMaterial.get('myMaterial')).push(this.addOtherFormGroup());
    //   this.filteredOption[this.currentIndex] = null
    // }
    // else if (!check.alreadyUsedBefore && !check.alreadyPresentInDb) {
    //   this._snackBar.open("Set New Material Name", "", {
    //     duration: 4000,
    //     panelClass: ["warning-snackbar"],
    //     verticalPosition: "bottom"
    //   });
    //   (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).controls['materialName'].reset();
    // }
    // else {
    //   this._snackBar.open("Material Name already exist in all material", "", {
    //     duration: 4000,
    //     panelClass: ["warning-snackbar"],
    //     verticalPosition: "bottom"
    //   });
    //   (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).controls['materialName'].reset();
    // }
    let checkData = { tradeName: this.currentData.trade, materialName: this.currentData.materialName, categoryName: this.currentData.category }
    this.bomService.getMaterialExist(checkData).then(res => {
      if (res.data) {
        let currentMaterialName = (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).value['materialName'];
        let alreadyPresent = this.currentIndex == 0 ? false : (this.addMyMaterial.get("myMaterial").value.some((val, i) => {
          return (i !== this.currentIndex && val.materialName === currentMaterialName)
        }))
        if (!alreadyPresent) {
          (<FormArray>this.addMyMaterial.get('myMaterial')).push(this.addOtherFormGroup());
        }
        else {
          this._snackBar.open("Set New Material Name", "", {
            duration: 4000,
            panelClass: ["warning-snackbar"],
            verticalPosition: "bottom"
          });
        }
      }
      else {
        this._snackBar.open("Material Name already exist in all material", "", {
          duration: 4000,
          panelClass: ["warning-snackbar"],
          verticalPosition: "bottom"
        });
        (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).controls['materialName'].reset();
      }
    })

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
    // let check = this.checkMaterialExist()
    // if (!check.alreadyUsedBefore && !check.alreadyPresentInDb) {
    //   let myMaterial = this.addMyMaterial.get("myMaterial").value.map(val => {
    //     return {
    //       estimatedPrice: Number(val.estimatedPrice),
    //       estimatedQty: Number(val.estimatedQty),
    //       materialName: val.materialName,
    //       materialGroupCode: val.category.categoriesCode,
    //       materialGroup: val.category.categoriesName,
    //       materialUnit: val.materialUnit,
    //       tradeId: val.trade.tradeId
    //     }
    //   })
    //   this.bomService.addMyMaterial(this.data, myMaterial).then(res => {
    //     if (res.message = "done") {
    //       this._snackBar.open("My Materials Added", "", {
    //         duration: 4000,
    //         panelClass: ["warning-snackbar"],
    //         verticalPosition: "bottom"
    //       });
    //     }
    //     this.dialogRef.close(null);
    //   });
    // }

    // else if (!check.alreadyUsedBefore && !check.alreadyPresentInDb) {
    //   this._snackBar.open("Set New Material Name", "", {
    //     duration: 4000,
    //     panelClass: ["warning-snackbar"],
    //     verticalPosition: "bottom"
    //   });
    //   (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).controls['materialName'].reset();
    // }
    // else {
    //   this._snackBar.open("Material Name already exist in all material", "", {
    //     duration: 4000,
    //     panelClass: ["warning-snackbar"],
    //     verticalPosition: "bottom"
    //   });
    //   (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).controls['materialName'].reset();
    // }
    let checkData = { tradeName: this.currentData.trade, materialName: this.currentData.materialName, categoryName: this.currentData.category }
    this.bomService.getMaterialExist(checkData).then(res => {
      if (res.data) {
        let currentMaterialName = (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).value['materialName'];
        let alreadyPresent = this.currentIndex == 0 ? false : (this.addMyMaterial.get("myMaterial").value.some((val, i) => {
          return (i !== this.currentIndex && val.materialName === currentMaterialName)
        }))
        if (!alreadyPresent) {
          let myMaterial = this.addMyMaterial.get("myMaterial").value.map(val => {
            return {
              estimatedPrice: null,
              estimatedQty: null,
              materialName: val.materialName,
              materialGroupCode: typeof (val.category) === 'string' ? null : val.category.categoriesCode,
              materialGroup: typeof (val.category) === 'string' ? val.category : val.category.categoriesName,
              materialUnit: val.materialUnit,
              tradeId: val.trade.tradeId
            }
          })
          this.bomService.addMyMaterial(this.data, myMaterial).then(res => {
            if (res.message = "done") {
              this._snackBar.open("My Materials Added", "", {
                duration: 4000,
                panelClass: ["warning-snackbar"],
                verticalPosition: "bottom"
              });
            }
            this.dialogRef.close(true);
          });
        }
        else {
          this._snackBar.open("Set New Material Name", "", {
            duration: 4000,
            panelClass: ["warning-snackbar"],
            verticalPosition: "bottom"
          });
        }
      }
      else {
        this._snackBar.open("Material Name already exist in all material", "", {
          duration: 4000,
          panelClass: ["warning-snackbar"],
          verticalPosition: "bottom"
        });
        (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).controls['materialName'].reset();
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}