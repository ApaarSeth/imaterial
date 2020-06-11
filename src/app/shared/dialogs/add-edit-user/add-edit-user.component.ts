import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { Roles, AllUserDetails, UserDetailsPopUpData, UserAdd } from '../../models/user-details';
import { UserService } from '../../services/userDashboard/user.service';
import { Router } from '@angular/router';
import { FieldRegExConst } from '../../constants/field-regex-constants';
import { ProjectService } from '../../services/projectDashboard/project.service';
import { ProjectDetails } from '../../models/project-details';
import { CountryCode } from '../../models/currency';
import { VisitorService } from '../../services/visitor.service';
import { CommonService } from '../../services/commonService';


export interface City {
  value: string;
  viewValue: string;
}

export interface ProjectType {
  type: string;
}

export interface Unit {
  value: string;
}

@Component({
  selector: "add-edit-user-dialog",
  templateUrl: "add-edit-user-component.html"
})

export class AddEditUserComponent implements OnInit {

  form: FormGroup;
  startDate = new Date(1990, 0, 1);
  endDate = new Date(2021, 0, 1);
  allProjects: ProjectDetails[];
  allRoles: Roles[];
  userDetails: AllUserDetails;
  isInputDisabled: boolean = true;
  orgId: number;
  userId: number;
  emailVerified: boolean = true;
  emailMessage: string;
  ipaddress: string;
  countryList: CountryCode[] = [];
  livingCountry: CountryCode[] = [];
  searchCountry: string = '';

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetailsPopUpData,
    private formBuilder: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private _snackBar: MatSnackBar,
    private visitorsService: VisitorService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getLocation();
    this.initForm();
    this.orgId = Number(localStorage.getItem("orgId"))
    this.userId = Number(localStorage.getItem("userId"))
    this.projectService.getUserProjects().then(data => {
      this.allProjects = data.data;
    });

    this.userService.getRoles().then(data => {
      this.allRoles = data.data;
    });
  }

  getLocation() {
    this.visitorsService.getIpAddress().subscribe(res => {
      this.ipaddress = res[ 'ip' ];
      this.visitorsService.getGEOLocation(this.ipaddress).subscribe(res => {
        if (this.data.isEdit && this.data.detail.countryCode) {
          this.getCountryCode(this.data.detail.countryCode);
        } else {
          this.getCountryCode(res[ 'calling_code' ]);
        }
      });
    });
  }

  getCountryCode(callingCode) {
    this.commonService.getCountry().then(res => {
      this.countryList = res.data;
      this.livingCountry = this.countryList.filter(val => {
        return val.callingCode === callingCode;
      })
      this.form.get('countriesList').setValue(this.livingCountry[ 0 ])
      if (this.data.isEdit && (this.data.detail.accountStatus == 1)) {
        this.form.get('countriesList').disable();
      }
    })
  }

  get selectedCountry() {
    return this.form.get('countriesList').value;
  }

  close() {
    this.dialogRef.close(null);
  }

  initForm() {

    this.userDetails = this.data.isEdit
      ? this.data.detail
      : ({} as AllUserDetails);

    this.isInputDisabled = this.data.isEdit;

    this.form = this.formBuilder.group({
      firstName: new FormControl(
        { value: this.data.isEdit ? this.data.detail.firstName : "", disabled: (this.data.isEdit && (this.data.detail.accountStatus == 1)) ? true : false },
        Validators.required
      ),
      lastName: new FormControl(
        { value: this.data.isEdit ? this.data.detail.lastName : "", disabled: (this.data.isEdit && (this.data.detail.accountStatus == 1)) ? true : false },
        Validators.required
      ),
      email: new FormControl(
        { value: this.data.isEdit ? this.data.detail.email : "", disabled: (this.data.isEdit && (this.data.detail.accountStatus == 1)) ? true : false },
        [ Validators.required, Validators.pattern(FieldRegExConst.EMAIL) ]),

      contactNo: new FormControl(
        { value: this.data.isEdit ? this.data.detail.contactNo : "", disabled: (this.data.isEdit && (this.data.detail.accountStatus == 1)) ? true : false },
        [ Validators.pattern(FieldRegExConst.MOBILE3) ]
      ),
      roleId: new FormControl(
        this.data.isEdit ? this.data.detail.roleId : "",
        Validators.required
      ),
      projectIds: new FormControl(
        this.data.isEdit ? this.data.detail.projectIds : []
      ),
      creatorId: new FormControl(''),
      userId: new FormControl(this.data.isEdit ? this.data.detail.userId : null),
      countryCode: [ "" ],
      countriesList: []
    });
  }

  addUsers(userDetails: UserAdd) {

    userDetails.creatorId = this.userId;
    userDetails.projects = userDetails.projectIds;

    var form_data = new FormData();

    for (var key in userDetails) {
      form_data.append(key, userDetails[ key ]);
    }

    this.userService.addUsers(userDetails).then(res => {
      if (res) {
        this.dialogRef.close(res.message);
        this._snackBar.open(res.message, "", {
          duration: 2000,
          panelClass: [ "success-snackbar" ],
          verticalPosition: "bottom"
        });
        return res.data;
      }

    });
  }

  updateUsers(userDetails: UserAdd) {
    if (userDetails) {
      userDetails.creatorId = this.userId;
      userDetails.userId = userDetails.userId;

      this.userService
        .updateUsers(userDetails)
        .then(res => {
          if (res) {
            this.dialogRef.close(res.message);
            this._snackBar.open(res.message, "", {
              duration: 2000,
              panelClass: [ "success-snackbar" ],
              verticalPosition: "bottom"
            });
            return res.data;
          }
        });
    }
  }

  submit() {
    let data = this.form.value;
    if (data.contactNo) {
      data.countryId = this.form.get('countriesList').value.countryId;
      data.countryCode = this.form.get('countriesList').value.callingCode;
    } else {
      data.countryId = null;
      data.countryCode = '';
    }
    delete data.countriesList;

    if (this.data.isEdit) {
      this.updateUsers(data);
    } else {
      this.addUsers(data);
    }
  }

  verifyEmail(event) {
    const email = event.target.value;
    this.emailVerified = true;
    if (email.match(FieldRegExConst.EMAIL)) {
      if (!((this.data.isEdit) && (this.data.detail.email === email))) {
        this.userService.verifyEMAIL(this.form.value.email).then(res => {
          if (res) {
            this.emailVerified = res.data;
            this.emailMessage = res.message;
          }
        });
      }

    }
  }

  userDetailsNavigate() {
    this.router.navigate([ "/users" ]);
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
}