import { OnInit, Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { UserRoles, UserDetails, TradeList } from 'src/app/shared/models/user-details';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { Router } from '@angular/router';
import { elementAt, count } from 'rxjs/operators';

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

  constructor(private _userService: UserService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private _router: Router) { }

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
      if (res.data[0].roleName) {
        localStorage.setItem("role", res.data[0].roleName);
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
    console.log(this.addUserForm);
  }

  /**
   * @description Append a new row after click on + button
   */
  onAddRow() {
    (<FormArray>this.addUserForm.get('other')).push(this.addOtherFormGroup());
    console.log(this.addUserForm);
  }

  /**
   * @description Create formcontrols after click on + button
   */

  onDelete(index) {
    (<FormArray>this.addUserForm.get('other')).removeAt(index)
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

  verifyEmail(event,formNo,index) {
    const email = event.target.value;
    if (email.match(FieldRegExConst.EMAIL)) {
          this.userService.verifyEMAIL(formNo.value).then(res => {
        if (res) {
          this.index[index] = res.data;
          this.emails[index]=formNo.value;
          this.emailVerified = true;
          this.index.forEach(element => {
            if(!element)
            this.emailVerified = false;
          })
          this.count = 0;
          for(let i=0; i<this.emails.length-1;i++){
            for(let j=i+1 ;j<this.emails.length;j++){
              if(this.emails[i] == this.emails[j])
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
          this._router.navigate(['/dashboard']);
        }
      });
    });
  }
}