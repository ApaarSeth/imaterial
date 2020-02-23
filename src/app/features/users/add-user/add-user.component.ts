import { OnInit, Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { UserRoles, UserDetails, TradeList } from 'src/app/shared/models/user-details';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { Router } from '@angular/router';

export interface City {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html'
})

export class AddUserComponent implements OnInit {

  roles: UserRoles;
  addUserForm: FormGroup;
  users: UserDetails;
  rows: FormArray;
  creatorId: number;

  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _router: Router) { }

  ngOnInit() {
    this.creatorId = Number(localStorage.getItem("userId"));
    this.getUserRoles();
    this.formInit();
  }

  /**
   * @description Get all user roles
   */
  getUserRoles() {
    this._userService.getRoles().then(res => {
      this.roles = res.data;
    })
  }

  /**
   * @description Create fromcontrols for existing row
   */
  formInit() {
    this.addUserForm = this._formBuilder.group({
      other: this._formBuilder.array([this.addOtherFormGroup()])
    });

    this.rows = this._formBuilder.array([]);
  }

  /**
   * @description Append a new row after click on + button
   */
  onAddRow() {
    (<FormArray>this.addUserForm.get('other')).push(this.addOtherFormGroup());
  }

  /**
   * @description Create formcontrols after click on + button
   */
  addOtherFormGroup(): FormGroup {
    return this._formBuilder.group({
      email: ['', {
        validators: [
          Validators.required,
          Validators.pattern(FieldRegExConst.EMAIL)
        ]
      }
      ],
      contactNo: ['', {
        validators: [
          Validators.required,
          Validators.pattern(FieldRegExConst.PHONE)
        ]
      }
      ],
      roleId: [null, Validators.required],
      firstName: [''],
      lastName: [''],
      projectIds: [[]],
      creatorId: [this.creatorId],
      userId: [null],
    });
  }

  /**
   * @description To submit the data after click on Done button
   */
  submit() {
    const data = this.addUserForm.value.other;
    data.map(user => {
      this._userService.addUsers(user).then(res => {
        if (res) {
          this._router.navigate(['/dashboard']);
        }
      });
    });
  }
}