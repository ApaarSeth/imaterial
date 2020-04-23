import { OnInit, Component, Inject, ViewChild, NgZone } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { UserRoles, UserDetails, TradeList, UserDetailsPopUpData } from 'src/app/shared/models/user-details';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { Router } from '@angular/router';
import { elementAt, count, take, startWith, map, filter, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { BomService } from '../../services/bom/bom.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { orgTrades, tradeRelatedCategory } from '../../models/trades';
import { Subject, Observable, merge } from 'rxjs';

export interface City {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-my-material',
  templateUrl: './add-my-material.component.html'
})

export class AddMyMaterialComponent implements OnInit {

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
  materialUnit: string[]
  tradesList: orgTrades[] = [];
  filteredOption: [tradeRelatedCategory[]] = [null];
  filterOptions: Observable<tradeRelatedCategory[] | [string]>;


  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private bomService: BomService,
    private _router: Router,
    private navService: AppNavigationService,
    private dialogRef: MatDialogRef<AddMyMaterialComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {

    this.creatorId = Number(localStorage.getItem("userId"));
    this.getUserData(this.creatorId);
    this.getUserRoles();
    this.getMaterialUnit();
    this.getTrades();
    this.formInit();
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
      if (res.data[0].roleName) {
        localStorage.setItem("role", res.data[0].roleName);
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
      materialName: ['', Validators.required],
      materialUnit: ['', Validators.required],
      index: [],
      estimatedQty: ['', Validators.required],
      estimatedPrice: [''],
      trade: [''],
      category: [''],
    });

    formGrp.get("index").patchValue(this.addMyMaterial.get('myMaterial')['controls'].length)
    formGrp.controls['category'].valueChanges.subscribe(changes => {
      // this.filteredOption[formGrp.get("index").value] = this._filter(changes, formGrp.get("index").value)
      this.filterOptions = null;
      this.filterOptions = new Observable((observer) => {
        const val: tradeRelatedCategory[] | [string] = this._filter(changes, formGrp.get("index").value)
        // observable execution
        observer.next(val)
        observer.complete()
      })
      console.log('this.filteredOption', formGrp.get("index").value);
      console.log('this.filteredOption', this.filteredOption[formGrp.get("index").value]);
    })

    formGrp.controls['trade'].valueChanges.subscribe(changes => {
      if (changes) {
        this.bomService.getTradeCategory(changes.tradeName).then(res => {
          this.filteredOption[formGrp.get("index").value] = [...res.data];
          this.filterOptions = new Observable((observer) => {
            const val: tradeRelatedCategory[] | [string] = this._filter('', formGrp.get("index").value)
            // observable execution
            observer.next(val)
            observer.complete()
          })
        })
      }
    })
    return formGrp;
  }

  private _filter(value: string | tradeRelatedCategory, index) {
    if (value || value === "") {
      const filterValue = typeof (value) === "string" ? value.toLowerCase() : value.categoriesName.toLowerCase();
      if (filterValue === '') {
        return this.filteredOption[index];
      }
      let filteredValue: tradeRelatedCategory[] | [string] = !this.filteredOption[index] ? [] : this.filteredOption[index].filter(option => option.categoriesName.toLowerCase().includes(filterValue));
      if (!filteredValue.length) {
        filteredValue = [{ categoriesName: filterValue + " (new value)", categoriesCode: null }]
      }
      return filteredValue;
    }
  }

  get currentData() {
    let currentIndex = this.addMyMaterial.get('myMaterial')['controls'].length - 1;
    let { trade, materialName, category } = (<FormArray>this.addMyMaterial.get('myMaterial')).controls[currentIndex].value;
    trade = !trade ? "" : trade.tradeName;
    category = !category ? "" : category.categoryName;
    return { trade, category, materialName }
  }

  onAddRow() {
    let checkData = { tradeName: this.currentData.trade, materialName: this.currentData.materialName, categoryName: this.currentData.category }
    this.bomService.getMaterialExist(checkData).then(res => {
      if (res.data) {
        let currentMaterialName = (<FormGroup>(<FormArray>this.addMyMaterial.get('myMaterial')).controls[this.currentIndex]).value['materialName'];

        let alreadyPresent = this.currentIndex == 0 ? false : (this.addMyMaterial.get("myMaterial").value.find(val => {
          return val.materialName === currentMaterialName
        }))
        if (!alreadyPresent) {
          (<FormArray>this.addMyMaterial.get('myMaterial')).push(this.addOtherFormGroup());
          this.filteredOption[this.currentIndex] = null
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
    this.filteredOption.splice(index, 1);
  }

  displayFn(option: tradeRelatedCategory) {
    return option && option.categoriesName ? option.categoriesName : ''
  }


  get currentIndex() {
    return this.addMyMaterial.get('myMaterial')['controls'].length - 1;
  }

  submit() {
    let checkData = { tradeName: this.currentData.trade, materialName: this.currentData.materialName, categoryName: this.currentData.category }
    this.bomService.getMaterialExist(checkData).then(res => {
      if (res.data) {
        let myMaterial = this.addMyMaterial.get("myMaterial").value.map(val => {
          return {
            estimatedPrice: Number(val.estimatedPrice),
            estimatedQty: Number(val.estimatedQty),
            materialName: val.materialName,
            materialGroupCode: val.category.categoriesCode,
            materialGroup: val.category.categoriesName,
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
          this.dialogRef.close(null);
        });
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