import { OnInit, Component, Inject, ViewChild, NgZone } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { UserRoles, UserDetails, TradeList, UserDetailsPopUpData } from 'src/app/shared/models/user-details';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { Router } from '@angular/router';
import { elementAt, count, take, startWith, map, filter, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AppNavigationService } from 'src/app/shared/services/navigation.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BomService } from '../../services/bom/bom.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { orgTrades } from '../../models/trades';
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
  filteredOption: [string[]] = [null];
  filterOptions: Observable<string[]>;


  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private bomService: BomService,
    private _router: Router,
    private navService: AppNavigationService,
    private dialogRef: MatDialogRef<AddMyMaterialComponent>,
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


  /**
   * @description Create fromcontrols for existing row
   */
  formInit() {
    this.addMyMaterial = this._formBuilder.group({
      myMaterial: this._formBuilder.array([])
    });
    (<FormArray>this.addMyMaterial.get("myMaterial")).push(this.addOtherFormGroup());
    (<FormArray>this.addMyMaterial.get("myMaterial")).push(this.addOtherFormGroup());
  }

  addOtherFormGroup(): FormGroup {
    const formGrp = this._formBuilder.group({
      materialName: [],
      unit: [],
      index: [],
      quantity: [],
      unitRate: [],
      trade: [],
      category: [],
    });

    formGrp.get("index").patchValue(this.addMyMaterial.get('myMaterial')['controls'].length)
    formGrp.controls['category'].valueChanges.subscribe(changes => {
      // this.filteredOption[formGrp.get("index").value] = this._filter(changes, formGrp.get("index").value)
      this.filterOptions = null;
      this.filterOptions = new Observable((observer) => {
        const val: string[] = this._filter(changes, formGrp.get("index").value)
        // observable execution
        observer.next(val)
        observer.complete()
      })
      console.log('this.filteredOption', formGrp.get("index").value);
      console.log('this.filteredOption', this.filteredOption[formGrp.get("index").value]);
    })

    // formGrp.controls['trade'].valueChanges.subscribe(changes => {
    //   this.bomService.getTradeCategory(changes.tradeName).then(res => {
    //     this.filteredOption[formGrp.get("index").value] = [...res.data];
    //     this.filterOptions = new Observable((observer) => {
    //       const val: string[] = this._filter('', formGrp.get("index").value)
    //       // observable execution
    //       observer.next(val)
    //       observer.complete()
    //     })
    //   })
    // })
    return formGrp;
  }

  private _filter(value: string, index): string[] {
    const filterValue = value.toLowerCase();
    if (filterValue === '') {
      return this.filteredOption[index];
    }
    let filteredValue = !this.filteredOption[index] ? [] : this.filteredOption[index].filter(option => option.toLowerCase().includes(filterValue));
    if (!filteredValue.length) {
      filteredValue = [filterValue + " (new value)"]
    }
    return filteredValue;
  }


  /**
   * @description Append a new row after click on + button
   */
  onAddRow() {
    (<FormArray>this.addMyMaterial.get('myMaterial')).push(this.addOtherFormGroup());
    // this.categoryChange();
    this.addUserFormLength = this.addMyMaterial.get('myMaterial')['controls'].length;
    if (this.index[this.addUserFormLength - 1] == 'false') {
      this.index[this.addUserFormLength - 1] = 'true';
    }
    this.filteredOption[this.addUserFormLength - 1] = null
  }

  /**
   * @description Create formcontrols after click on + button
   */

  onDelete(index) {
    (<FormArray>this.addMyMaterial.get('other')).removeAt(index);
    this.filteredOption.splice(index, 1);
  }



  /**
   * @description To submit the data after click on Done button
   */
  submit() {
    const data = this.addMyMaterial.value.other;
    data.map(user => {
      this._userService.addUsers(user).then(res => {
        if (res) {
          this.navService.gaEvent({
            action: 'submit',
            category: 'Add_user_requested',
            label: 'role/email-id',
            value: null
          });
          this._router.navigate(['/dashboard']);
        }
      });
    });
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}