import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RFQService } from 'src/app/shared/services/rfq/rfq.service';
import { SuppliersDialogComponent } from 'src/app/shared/dialogs/add-supplier/suppliers-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { initiatePo, initiatePoData } from 'src/app/shared/models/PO/po-data';

@Component({
  selector: "app-po-supplier",
  templateUrl: "./po-supplier.component.html"
})
export class PoSupplierComponent implements OnInit {
  @Output() selectedSupplier = new EventEmitter<any>();
  @Input() poData: initiatePoData;
  buttonName: string = "selectSupplier";
  searchText: string = null;
  allSuppliers: Suppliers[];
  form: FormGroup;
  displayedColumns: string[] = ["Supplier Name", "Email", "Phone No."];

  constructor(private formBuilder: FormBuilder,
    private rfqService: RFQService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.allSuppliers = this.activatedRoute.snapshot.data.inititatePo[0].data;
    this.formInit();
  }

  selectProject() { }

  getSuppliers() {
    let userId = Number(localStorage.getItem("userId"));
    let orgId = Number(localStorage.getItem("orgId"));

    this.rfqService.getSuppliers(orgId).then(data => {
      this.allSuppliers = data.data;;
    });
  }

  formInit() {
    this.form = this.formBuilder.group({
      supplier: ["", [Validators.required]]
    });
  }

  setButtonName(name: string) {
    this.buttonName = name;
  }

  choosenSupplier() {
    let existingPoData: initiatePoData = {
      selectedMaterial: this.poData ? this.poData.selectedMaterial : null,
      selectedSupplier: this.form.value.supplier
    }
    return this.selectedSupplier.emit(existingPoData);
  }
  openSupplierDialog() {
    const dialogRef = this.dialog.open(SuppliersDialogComponent, {
      width: "660px"
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => {
        if (result === 'done') {
          this.getSuppliers();
        }
      });
  }
}
