import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { ProjectDetails, ProjetPopupData } from "../../models/project-details";
import { ProjectService } from "../../services/project.service";
import { FieldRegExConst } from "../../constants/field-regex-constants";
import { Router } from '@angular/router';
import { AppNavigationService } from '../../services/navigation.service';
import { FacebookPixelService } from '../../services/fb-pixel.service';
import { CountryCode } from '../../models/currency';
import { CommonService } from '../../services/commonService';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DocumentUploadService } from "../../services/document-download.service";

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
  selector: "add-project-dialog",
  templateUrl: "./add-project.component.html"
})
export class AddProjectComponent implements OnInit {

  form: FormGroup;
  startDate = new Date(1990, 0, 1);
  endDate = new Date(2021, 0, 1);
  projectEndDate: Date;
  minDate = new Date();
  projectDetails: ProjectDetails;
  orgId: number;
  userId: number;
  selectedConstructionUnit: String;
  startstring: string;
  sameStartEndDate: boolean = false;
  endstring: string;
  localImg: string | ArrayBuffer;
  city: string;
  state: string;
  validPincode: boolean = null;
  pincodeLength: number;
  imageFileSizeError: string = "";
  imageFileSize: boolean = false;
  fileTypes: string[] = ['png', 'jpeg', 'jpg'];

  ipaddress: string;
  countryList: CountryCode[] = [];
  livingCountry: CountryCode[] = [];
  searchCountry: string = '';
  selectedCountryId: number;
  calingCode: string;
  cntryId: number;
  countryCode: string;
  isMobile: boolean;
  costUnits: Unit[];
  currencyCode: string;
  constructor(
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjetPopupData,
    private _uploadImageService: DocumentUploadService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private navService: AppNavigationService,
    private fbPixel: FacebookPixelService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.validPincode = this.data.isEdit ? true : false;
    this.countryList = this.data.countryList;
    this.currencyCode = localStorage.getItem('currencyCode');
    this.countryCode = localStorage.getItem('countryCode');
    let unitArray = this.countryCode === "IN" ? [{ value: "Lakh" }, { value: "Crore" }] : [{ value: "Thousand" }, { value: "Million" }, { value: "Billion" }]
    this.costUnits = [...unitArray];
    this.cntryId = Number(localStorage.getItem('countryId'));
    if (localStorage.getItem('countryCode')) {
      this.calingCode = localStorage.getItem('countryCode');
    }
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.isMobile = this.commonService.isMobile().matches;
    // this.selectedConstructionUnit = "1";
    this.initForm();
    this.getLocation();
    if (this.data.isEdit) {
      if (this.data.detail.pinCode) {
        this.cityStateFetch(this.data.detail.pinCode);
      }
    }
  }

  getLocation() {
    if (this.countryList) {
      this.countryCodeCondition()
    }
    this.commonService.getCountry().then((res) => {
      this.countryList = res.data
      this.countryCodeCondition()
    });
  }

  countryCodeCondition() {
    if (this.data.isEdit && this.data.detail.countryId) {
      this.getCountryCode({ callingCode: null, countryId: this.data.detail.countryId });
    } else if (this.cntryId) {
      this.getCountryCode({ callingCode: null, countryId: this.cntryId });
    } else {
      this.getCountryCode({ countryId: localStorage.getItem('countryId') });
    }
  }

  blankPincode() {
    this.form.get('pinCode').setValue('');
    this.city = "";
    this.state = "";
    this.form.get('city').setValue("");
    this.form.get('state').setValue("");
  }

  getCountryCode(obj) {
    this.livingCountry = this.countryList.filter(val => {
      if (obj.countryId) {
        return val.countryId === Number(obj.countryId);
      } else {
        return val.callingCode === obj.callingCode;
      }
    })
    this.form.get('countryCode').setValue(this.livingCountry[0]);
  }

  get selectedCountry() {
    if (this.form.get('countryCode').value) {
      this.selectedCountryId = this.form.get('countryCode').value.countryId;
    }
    return this.form.get('countryCode').value;
  }

  projectTypes: ProjectType[] = [
    { type: "RESIDENTIAL" },
    { type: "COMMERCIAL" },
    { type: "INTERIOR FIT-OUT" },
    { type: "INDUSTRIAL" },
    { type: "HOSPITALITY" },
    { type: "INFRASTRUCTURE" },
    { type: "OTHERS" }
  ];

  units: Unit[] = [{ value: "acres" }, { value: "sqm" }, { value: "sqft" }, { value: "km" }];


  initForm() {
    this.projectDetails = this.data.isEdit
      ? this.data.detail
      : ({} as ProjectDetails);
    this.form = this.formBuilder.group({
      projectName: [
        this.data.isEdit ? this.data.detail.projectName : "",
        Validators.required
      ],
      addressLine1: [
        this.data.isEdit ? this.data.detail.addressLine1 : "",
        [Validators.required, Validators.maxLength(120)]
      ],
      addressLine2: [this.data.isEdit ? this.data.detail.addressLine2 : "", Validators.maxLength(120)],
      pinCode: [
        this.data.isEdit ? this.data.detail.pinCode : "",
        // [Validators.required, Validators.pattern(FieldRegExConst.PINCODE)]
        [Validators.required]
      ],
      state: [
        { value: this.data.isEdit ? this.data.detail.state : "", disabled: true },
        Validators.required
      ],
      city: [
        { value: this.data.isEdit ? this.data.detail.city : "", disabled: true },
        Validators.required
      ],
      area: [
        this.data.isEdit ? this.data.detail.area : "",
        [Validators.required, Validators.pattern(FieldRegExConst.RATES)]
      ],
      startDate: [
        this.data.isEdit ? this.data.detail.startDate : "",
        Validators.required
      ],
      endDate: [
        this.data.isEdit ? this.data.detail.endDate : "",
        Validators.required
      ],
      cost: [
        this.data.isEdit ? this.data.detail.cost : "",
        [Validators.required, Validators.pattern(FieldRegExConst.RATES)]
      ],
      type: [
        this.data.isEdit ? this.data.detail.type : "",
        Validators.required
      ],
      unit: [this.data.isEdit ? this.data.detail.unit : "", Validators.required],
      gstNo: [
        this.data.isEdit ? this.data.detail.gstNo : "",
        [Validators.pattern(FieldRegExConst.GSTIN)]
      ],
      costUnit: [this.data.isEdit ? this.data.detail.costUnit : "", Validators.required],
      imageUrl: [this.data.isEdit ? this.data.detail.imageFileName : ""],
      countryId: [null],
      countryCode: []
    });
    this.form.get('startDate').valueChanges.subscribe(res => {
      this.projectEndDate = new Date(res)
      this.projectEndDate.setDate(this.projectEndDate.getDate() + 1)
    });
    if (!this.projectEndDate) {
      this.projectEndDate = new Date(this.form.get('startDate').value)
      this.projectEndDate.setDate(this.projectEndDate.getDate() + 1)
    }
  }

  addProjects(projectDetails: ProjectDetails) {
    this.projectService
      .addProjects(projectDetails, this.orgId, this.userId)
      .then(res => {
        this.fbPixel.fire('CompleteRegistration')
        this.navService.gaEvent({
          action: 'submit',
          category: 'Project_created',
          label: 'project_name',
          value: null
        });
        // res.data;
        this.dialogRef.close(res.message);
        // if (res) {
        //   this._snackBar.open(res.message, "", {
        //     duration: 2000,
        //     panelClass: ["success-snackbar"],
        //     verticalPosition: "bottom"
        //   });
        // }
      });
  }

  updateProjects(projectDetails: ProjectDetails) {
    if (projectDetails) {
      let projectId = this.data.detail.projectId;
      let organizationId = this.data.detail.organizationId;
      this.projectService
        .updateProjects(organizationId, projectId, projectDetails)
        .then(res => {
          this.dialogRef.close(res.message)

        });
    }
  }

  formatDate(oldDate): Date {
    let newDate = new Date(oldDate);
    newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
    return newDate;
  }

  submit() {
    this.form.value.countryId = this.form.get('countryCode').value.countryId;
    delete this.form.value.countryCode;
    if (this.data.isEdit) {
      this.form.value.startDate = this.formatDate(this.form.value.startDate);
      this.form.value.endDate = this.formatDate(this.form.value.endDate);
      this.form.value.city = this.city;
      this.form.value.state = this.state;
      this.form.value.cost = Number(this.form.value.cost)
      this.form.value.area = Number(this.form.value.area)
      this.updateProjects(this.form.value);
    } else {
      this.form.value.city = this.city;
      this.form.value.state = this.state;
      this.form.value.cost = Number(this.form.value.cost)
      this.form.value.area = Number(this.form.value.area)
      this.form.value.startDate = this.formatDate(this.form.value.startDate);
      this.form.value.endDate = this.formatDate(this.form.value.endDate);
      this.addProjects(this.form.value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

  getPincode(event) {
    this.validPincode = false;
    this.city = "";
    this.state = "";
    this.form.get('city').setValue("");
    this.form.get('state').setValue("");
    this.pincodeLength = event.target.value.length;
    if (event.target.value.length >= 3) {
      this.cityStateFetch(event.target.value);
    }

  }
  cityStateFetch(value) {
    this.commonService.getPincodeInternational(value, this.selectedCountryId).then(res => {
      if (res.data && res.data.length) {
        this.city = res.data[0].districtName;
        this.state = res.data[0].stateName;
        if (this.city && this.state)
          this.validPincode = true;
        else
          this.validPincode = false;

        this.form.get('city').setValue(res.data[0].districtName);
        this.form.get('state').setValue(res.data[0].stateName);
      }

    });
  }
  getStart(event) {
    // const x = event.indexOf('/');
    // const day = event.substring(0, x);

    // event = event.replace('/', '-');
    // const y = event.indexOf('/');
    // const month = event.substring(x + 1, y);


    // const year = event.substring(y + 1, 10);

    // this.minDate = new Date(year, month - 1, day);
    this.startstring = event;

    this.sameStartEndDate = this.isSameDay(this.startstring, this.endstring);
  }

  getEndDate(event) {
    // const x = event.indexOf('/');
    // const day = event.substring(0, x);

    // event = event.replace('/', '-');
    // const y = event.indexOf('/');
    // const month = event.substring(x + 1, y);


    // const year = event.substring(y + 1, 10);


    // const endDate = new Date(year, month - 1, day);
    this.endstring = event;

    this.sameStartEndDate = this.isSameDay(this.startstring, this.endstring);
  }

  isSameDay(dtFrom, dtTo) {
    return dtFrom == dtTo
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      const file = event.target.files[0];
      let fileSize = event.target.files[0].size; // in bytes
      let fileType = event.target.files[0].name.split('.').pop();

      if (this.fileTypes.some(element => {
        return element === fileType
      })) {
        if (fileSize < 1000000) {
          reader.onload = (event) => {
            this.localImg = (<FileReader>event.target).result;
          }
          this.imageFileSizeError = "";
          this.imageFileSize = true;
          this.uploadImage(file);
        }
        else {
          this.imageFileSize = false;
          this.imageFileSizeError = "Image must be less than 1 mb";
        }
      }
      else {
        if (this.data && this.data.detail && this.data.detail.imageUrl)
          this.localImg = this.data.detail.imageUrl;

        this._snackBar.open("We don't support " + fileType + " in Image upload, Please uplaod pdf, doc, docx, jpeg, png", "", {
          duration: 2000,
          panelClass: ["success-snackbar"],
          verticalPosition: "bottom"
        });
      }

      // this.uploadImage(file);
    }
  }

  uploadImage(file) {
    if (file) {
      const data = new FormData();
      data.append(`file`, file);
      return this._uploadImageService.postDocumentUpload(data).then(res => {
        this.form.get('imageUrl').setValue(res.data.fileName);
      });
    }
  }

  customDateFormat(d: any, to?: string): string {
    if (!d) {
      return 'DD/MM/YYYY';
    }
    let date: Date = new Date(d);
    if (to) {
      date = new Date(date + to);
    }
    return `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
  }
}