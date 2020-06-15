import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { RFQService } from "../../services/rfq/rfq.service";
import { Suppliers } from "../../models/RFQ/suppliers";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FieldRegExConst } from '../../constants/field-regex-constants';
import { AppNavigationService } from '../../services/navigation.service';
import { VisitorService } from '../../services/visitor.service';
import { CommonService } from '../../services/commonService';
import { CountryCode } from '../../models/currency';

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

  constructor(
    public dialogRef: MatDialogRef<SuppliersDialogComponent>,
    private rfqService: RFQService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private navService: AppNavigationService,
    private visitorsService: VisitorService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('countryCode')) {
      this.calingCode = localStorage.getItem('countryCode');
    }
    this.getLocation();
    this.initForm();
    this.orgId = Number(localStorage.getItem("orgId"))
  }

  getLocation() {
    if (this.data.isEdit && this.data.detail.countryCode) {
      this.getCountryCode(this.data.detail.countryCode);
    } else if (this.calingCode) {
      this.getCountryCode(this.calingCode);
    } else {
      this.visitorsService.getIpAddress().subscribe(res => {
        this.ipaddress = res[ 'ip' ];
        this.visitorsService.getGEOLocation(this.ipaddress).subscribe(res => {
          this.getCountryCode(res[ 'calling_code' ]);
        });
      });
    }
  }

  getCountryCode(callingCode) {
    this.commonService.getCountry().then(res => {
      this.countryList = res.data;
      this.livingCountry = this.countryList.filter(val => {
        return val.callingCode === callingCode;
      })
      this.form.get('countryCode').setValue(this.livingCountry[ 0 ])
    })
  }

  get selectedCountry() {
    return this.form.get('countryCode').value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initForm() {
    this.form = this.formBuilder.group({
      supplier_name: [ "", Validators.required ],
      email: [ "", [ Validators.required, Validators.pattern(FieldRegExConst.EMAIL) ] ],
      contact_no: [ "", [ Validators.required, Validators.pattern(FieldRegExConst.MOBILE3) ] ],
      pan: [ "" ],
      countryCallingCode: [ "" ],
      countryCode: []
    });
  }

  submit() {
    let data = this.form.value;
    data[ 'countryCallingCode' ] = this.form.get('countryCode').value.callingCode;
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
          panelClass: [ "success-snackbar" ],
          verticalPosition: "bottom"
        });
      }

    });
  }

  close(): void {
    this.dialogRef.close(null);
  }
}