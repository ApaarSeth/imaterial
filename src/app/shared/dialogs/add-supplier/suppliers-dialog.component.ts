import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { RFQService } from "../../services/rfq/rfq.service";
import { Suppliers } from "../../models/RFQ/suppliers";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FieldRegExConst } from '../../constants/field-regex-constants';
import { AppNavigationService } from '../../services/navigation.service';

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

  constructor(
    public dialogRef: MatDialogRef<SuppliersDialogComponent>,
    private rfqService: RFQService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private navService: AppNavigationService
  ) { }

  ngOnInit() {
    this.initForm();
    this.orgId = Number(localStorage.getItem("orgId"))
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initForm() {
    this.form = this.formBuilder.group({
      supplier_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(FieldRegExConst.EMAIL)]],
      contact_no: ["", [Validators.required, Validators.pattern(FieldRegExConst.MOBILE)]],
      pan: [""]
    });
  }

  submit() {
    this.addSuppliers(this.data, this.form.value);
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
          verticalPosition: "top"
        });
      }

    });
  }

  close(): void {
    this.dialogRef.close(null);
  }
}