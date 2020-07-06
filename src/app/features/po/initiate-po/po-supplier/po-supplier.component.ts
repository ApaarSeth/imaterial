import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RFQService } from 'src/app/shared/services/rfq/rfq.service';
import { SuppliersDialogComponent } from 'src/app/shared/dialogs/add-supplier/suppliers-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { initiatePo, initiatePoData } from 'src/app/shared/models/PO/po-data';
import { SelectCurrencyComponent } from 'src/app/shared/dialogs/select-currency/select-currency.component';
import { rfqCurrency } from 'src/app/shared/models/RFQ/rfq-details';
import { CountryCode } from 'src/app/shared/models/currency';

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
  poCurrency: rfqCurrency;
  countryist: CountryCode[];
  constructor(private formBuilder: FormBuilder,
    private rfqService: RFQService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.allSuppliers = this.activatedRoute.snapshot.data.inititatePo[0].data;
    this.countryist = this.activatedRoute.snapshot.data.countryList

    this.formInit();
  }

  ngOnChanges(): void {
    this.poCurrency = this.poData && this.poData.poCurrency

  }

  selectProject() { }

  getSuppliers() {
    let userId = Number(localStorage.getItem("userId"));
    let orgId = Number(localStorage.getItem("orgId"));

    this.rfqService.getSuppliers(orgId).then(data => {
      this.allSuppliers = data.data;
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
      selectedSupplier: this.form.value.supplier,
      poCurrency: this.poCurrency
    }
    return this.selectedSupplier.emit(existingPoData);
  }


  openSupplierDialog() {
    let data = { countryList: this.countryist }
    const dialogRef = this.dialog.open(SuppliersDialogComponent, {
      width: "660px",
      data
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => {
        if (result === 'Supplier Successfully added') {
          this.getSuppliers();
        }
      });
  }

  selectCurrency() {
    const dialogRef = this.dialog.open(SelectCurrencyComponent, {
      disableClose: true,
      width: "500px",
      data: this.poCurrency
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.poCurrency = data;
      }
    });
  }
}
