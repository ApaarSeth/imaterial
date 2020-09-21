import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SuppliersDialogComponent } from 'src/app/shared/dialogs/add-supplier/suppliers-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { initiatePoData } from 'src/app/shared/models/PO/po-data';
import { SelectCurrencyComponent } from 'src/app/shared/dialogs/select-currency/select-currency.component';
import { rfqCurrency } from 'src/app/shared/models/RFQ/rfq-details';
import { CountryCode } from 'src/app/shared/models/currency';
import { CommonService } from 'src/app/shared/services/commonService';

@Component({
  selector: "app-po-supplier",
  templateUrl: "./po-supplier.component.html"
})

export class PoSupplierComponent implements OnInit {

  @Output() selectedSupplier = new EventEmitter<any>();
  @Input() poData: initiatePoData;
  @Input() searchVal: any;
  buttonName: string = "selectSupplier";
  searchText: string = null;
  allSuppliers: Suppliers[];
  form: FormGroup;
  displayedColumns: string[] = ["Supplier Name", "Email", "Phone No."];
  poCurrency: rfqCurrency;
  countryist: CountryCode[];
  isMobile: boolean;
  isRatingFeatureShow: boolean;

  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService) { }

  ngOnInit() {
    this.allSuppliers = this.activatedRoute.snapshot.data.inititatePo[0].data.supplierList;
    this.countryist = this.activatedRoute.snapshot.data.countryList;
    this.isMobile = this.commonService.isMobile().matches;
    this.formInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.poData && changes.poData.currentValue) {
      this.poCurrency = changes.poData.currentValue.poCurrency;
    }
    if (changes.searchVal && changes.searchVal.currentValue) {
      this.searchText = '';
    }

  }

  selectProject() { }

  getSuppliers() {
    let orgId = Number(localStorage.getItem("orgId"));
    this.commonService.getSuppliers(orgId).then(data => {
      this.allSuppliers = data.data.supplierList;

      const premiumFeature = data.data.moduleFeatures;
      if(premiumFeature.featuresList?.length > 0){
        this.isRatingFeatureShow = (premiumFeature.featureList[1].featureName === "supplier rating" && premiumFeature.featureList[1].isAvailable === 1) ? true : false;
      }
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
      data,
      panelClass: 'add-supplier-dialog'
    });
    dialogRef.afterClosed().toPromise().then(result => {
      if (result === 'Supplier Successfully added') {
        this.getSuppliers();
      }
    });
  }

  selectCurrency() {
    const dialogRef = this.dialog.open(SelectCurrencyComponent, {
      disableClose: true,
      width: "500px",
      data: this.poCurrency,
      panelClass: ['common-modal-style', 'select-currency-dialog']
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.poCurrency = data;
      }
    });
  }
}
