import { Component, Inject } from "@angular/core";
import { RFQService } from "../../services/rfq.service";
import { Suppliers } from "../../models/RFQ/suppliers";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FieldRegExConst } from '../../constants/field-regex-constants';
import { AppNavigationService } from '../../services/navigation.service';
import { VisitorService } from '../../services/visitor.service';
import { CommonService } from '../../services/commonService';
import { CountryCode } from '../../models/currency';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

// Component for dialog box
@Component({
  selector: "suppliers-dialog",
  templateUrl: "./suppliers-dialog.html"
})

// Component class
export class SuppliersDialogComponent {
  suppliers: Suppliers;
  form: FormGroup;
  orgId: number;
  ipaddress: string;
  countryList: CountryCode[] = [];
  livingCountry: CountryCode[] = [];
  searchCountry: string = '';
  calingCode: string;
  cntryId: number;
  isNational: boolean;
  isMobile: boolean;

  constructor(
    public dialogRef: MatDialogRef<SuppliersDialogComponent>,
    private rfqService: RFQService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private navService: AppNavigationService,
  ) { }

  ngOnInit() {
    this.countryList = this.data ? this.data.countryList : null;
    if (localStorage.getItem('countryCode')) {
      this.calingCode = localStorage.getItem('countryCode');
    }
    this.cntryId = Number(localStorage.getItem('countryId'));
    localStorage.getItem('countryCode') === 'IN' ? this.isNational = true : this.isNational = false;
    this.initForm();
    this.getLocation();
    this.orgId = Number(localStorage.getItem("orgId"))
  }

  getLocation() {
    if (this.cntryId) {
      this.getCountryCode({ callingCode: null, countryId: this.cntryId });
    } else {
      this.getCountryCode({ countryId: localStorage.getItem('countryId') });
    }
  }

  getCountryCode(obj) {
    this.livingCountry = this.countryList.filter(val => {
      if (obj.countryId) {
        return val.countryId === Number(obj.countryId);
      } else {
        return val.callingCode === obj.callingCode;
      }
    })
    this.form.get('countryCode').setValue(this.livingCountry[0])

  }

  get selectedCountry() {
    return this.form.get('countryCode').value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initForm() {
    this.form = this.formBuilder.group({
      supplier_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(FieldRegExConst.EMAIL)]],
      // contact_no: [ "", [ Validators.required, Validators.pattern(FieldRegExConst.MOBILE3) ] ],
      contact_no: [null, [Validators.pattern(FieldRegExConst.MOBILE3)]],
      pan: [""],
      countryCallingCode: [null],
      countryCode: []
    });
    if (this.isNational) {
      this.form.get('contact_no').setValidators([Validators.required, Validators.pattern(FieldRegExConst.MOBILE3)]);
    }
  }

  submit() {
    let data = this.form.value;
    if (data.contact_no) {
      data['countryCallingCode'] = this.form.get('countryCode').value.callingCode;
    }
    delete data.countryCode;
    this.addSuppliers(this.data, data);
  }

  addSuppliers(organisarionId: number, suppliers: Suppliers) {
    this.rfqService.addNewSupplier(this.orgId, suppliers).then(res => {
      if (res) {
        this.navService.gaEvent({
          action: 'submit',
          category: 'supplier_added',
          label: 'supplier_added',
          value: null
        });
        this.dialogRef.close(res.message);
        this._snackBar.open('Supplier Added', "", {
          duration: 2000,
          panelClass: ["success-snackbar"],
          verticalPosition: "bottom"
        });
      }

    });
  }

  close(): void {
    this.dialogRef.close(null);
  }
}