import { Component, OnInit } from "@angular/core"; import { UserRoles, UserDetails } from "../../../shared/models/user-details"; import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms"; import { UserService } from "../../../shared/services/user.service"; import { Router } from "@angular/router"; import { AppNavigationService } from "../../../shared/services/navigation.service"; import { FieldRegExConst } from "../../../shared/constants/field-regex-constants";

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
  emailVerified: boolean = true;
  emailMessage: string;

  creatorId: number;
  index: string[] = [];

  emails: string[] = [];
  count: any;
  addUserFormLength: number;
  check: boolean;

  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private _router: Router,
    private navService: AppNavigationService) { }

  ngOnInit() {
    this.creatorId = Number(localStorage.getItem("userId"));
    this.getUserData(this.creatorId);
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

  getUserData(userId) {
    this._userService.getUserInfo(userId).then(res => {
      if (res.data.roleName) {
        localStorage.setItem("role", res.data.roleName);
      }
    });
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
    this.addUserFormLength = this.addUserForm.get('other')['controls'].length;
    if (this.index[this.addUserFormLength - 1] == 'false') {
      this.index[this.addUserFormLength - 1] = 'true';
    }
  }

  /**
   * @description Create formcontrols after click on + button
   */

  onDelete(index) {
    (<FormArray>this.addUserForm.get('other')).removeAt(index);
    this.index.splice(index, 1);
    this.emails[index] = null;
    this.emails.splice(index, 1);
    this.index.forEach(element => {
      if (element == 'false') {
        this.emailVerified = false;
        this.check = true;
      }

    })
    if (this.check != true) {
      this.emailVerified = true;
      this.check = null;
    }

    this.count = 0;
    for (let i = 0; i < this.emails.length - 1; i++) {
      for (let j = i + 1; j < this.emails.length; j++) {
        if ((this.emails[i] != null) && (this.emails[j] != null) && (this.emails[i] == this.emails[j]))
          this.count++;
      }

    }
  }

  addOtherFormGroup(): FormGroup {
    return this._formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern(FieldRegExConst.EMAIL)
      ]

      ],
      // contactNo: ['', {
      //   validators: [
      //     // Validators.required,
      //     Validators.pattern(FieldRegExConst.PHONE)
      //   ]
      // }
      // ],
      roleId: [null, Validators.required],
      firstName: [''],
      lastName: [''],
      projectIds: [[]],
      creatorId: [this.creatorId],
      userId: [null],
    });
  }

  verifyEmail(event, formNo, index) {
    const email = event.target.value;
    this.index[index] = "true";
    if (email.match(FieldRegExConst.EMAIL)) {
      this.userService.verifyEMAIL(formNo.value).then(res => {
        if (res) {
          this.index[index] = res.data.toString();
          this.emails[index] = formNo.value;
          this.emailVerified = true;
          this.index.forEach(element => {
            if (element == 'false')
              this.emailVerified = false;
          })
          this.count = 0;
          for (let i = 0; i < this.emails.length - 1; i++) {
            for (let j = i + 1; j < this.emails.length; j++) {
              if ((this.emails[i] != null) && (this.emails[j] != null) && (this.emails[i] == this.emails[j]))
                this.count++;
            }
          }
          this.emailMessage = res.message;
        }
      });

    }
  }

  /**
   * @description To submit the data after click on Done button
   */
  submit() {
    const data = this.addUserForm.value.other;
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
}