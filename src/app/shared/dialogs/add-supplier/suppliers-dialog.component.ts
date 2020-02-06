import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RFQService } from "../../services/rfq/rfq.service";
import { Suppliers } from "../../models/RFQ/suppliers";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FieldRegExConst } from '../../constants/field-regex-constants';

// Component for dialog box
@Component({
  selector: "suppliers-dialog",
  templateUrl: "./suppliers-dialog.html"
})

// Component class
export class SuppliersDialogComponent {
  suppliers: Suppliers;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SuppliersDialogComponent>,
    private rfqService: RFQService,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  initForm() {
    this.form = this.formBuilder.group({
      supplier_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(FieldRegExConst.EMAIL)]],
      contact_no: ["", [Validators.required, Validators.pattern(FieldRegExConst.PHONE)]],
      pan: ["", Validators.required]
    });
  }

  submit() {
    console.log("form", this.form.value);
    this.dialogRef.close(this.addSuppliers(this.data, this.form.value));
    // if (this.data.isEdit) {
    //   this.dialogRef.close(this.updateProjects(this.form.value));
    // } else {
    //   this.dialogRef.close(this.addProjects(this.form.value));
    // }
  }

  addSuppliers(organisarionId: number, suppliers: Suppliers) {
    this.rfqService.addNewSupplier(1, suppliers).then(res => {
      res.data;
    });
  }
}
