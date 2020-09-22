import { featureList } from './../../../../shared/models/menu.model';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { AddRFQ } from "src/app/shared/models/RFQ/rfq-details";
import { SuppliersDialogComponent } from "src/app/shared/dialogs/add-supplier/suppliers-dialog.component";
import { FormGroup, FormBuilder, FormArray, AbstractControl } from "@angular/forms";
import { SelectRfqTermsComponent } from 'src/app/shared/dialogs/selectrfq-terms/selectrfq-terms.component';
import { Observable } from 'rxjs';
import { SelectCurrencyComponent } from 'src/app/shared/dialogs/select-currency/select-currency.component';
import { CountryCode } from 'src/app/shared/models/currency';
import { CommonService } from 'src/app/shared/services/commonService';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatCheckbox } from "@angular/material/checkbox";
import { AppNotificationService } from 'src/app/shared/services/app-notification.service';
import { ActivatedRoute } from '@angular/router';
import { data } from 'jquery';

@Component({
  selector: "app-rfq-supplier",
  templateUrl: "./rfq-supplier.component.html"
})

export class RfqSupplierComponent implements OnInit {

  @Input() finalRfq: AddRFQ;
  @Input() cntryList: CountryCode[];
  @Input() suppliers: Suppliers[];
  @Input() supplierModuleFeature: any;
  @Output() updatedRfq = new EventEmitter<AddRFQ>();
  searchText: string = null;
  buttonName: string = "selectSupplier";
  displayedColumns: string[] = [
    "Supplier Name",
    "Email",
    "Phone No."
  ];
  allSuppliers: Suppliers[];
  selectedSuppliersList: Suppliers[] = [];
  selectedSupplierFlag: boolean = false;
  checkedMaterialsList: AddRFQ;
  orgId: number;
  isMobile: boolean;
  rfqData: AddRFQ = {} as AddRFQ;
  supplierForm: FormGroup;
  supplierCounter: number = 0;
  newAddedId: number;
  countryist: CountryCode[];
  isRatingAvailable: boolean;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private notifier: AppNotificationService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.isMobile = this.commonService.isMobile().matches;
    if (this.supplierModuleFeature.featureList) {
      this.isRatingAvailable = this.supplierModuleFeature.featureList.some(item => (item.featureName.includes('supplier rating') && item.isAvailable === 1));
    }
    if (this.suppliers) {
      this.allSuppliers = this.suppliers;
    } else {
      this.allSuppliers = [];
    }
    this.countryist = this.cntryList;
    this.formInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.finalRfq && changes.finalRfq.currentValue) {
      this.rfqData = changes.finalRfq.currentValue;
      if (this.rfqData) {
        this.allSuppliers = this.activatedRoute.snapshot.data.rfqData[0].data ? this.activatedRoute.snapshot.data.rfqData[0].data.supplierList : [];
        this.supplierCounter = 0;
        this.allSuppliers = this.allSuppliers.map((supplier: Suppliers) => {
          supplier.show = true;
          if (this.finalRfq.supplierId && this.finalRfq.supplierId.includes(supplier.supplierId)) {
            supplier.checked = true;
            this.supplierCounter++;
          }
          else {
            supplier.checked = false
          }
          return supplier;
        })
      }
      this.formInit();
    }
  }


  formInit() {
    const frmArr: FormGroup[] = this.allSuppliers.map(supplier => {
      return this.formBuilder.group({
        supplier: [supplier.checked ? supplier : null]
      });
    });
    this.supplierForm = this.formBuilder.group({
      forms: new FormArray(frmArr)
    });
  }

  supplierCheck() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let check = control.value.some(supp => {
        return supp.supplier != null
      })
      if (check) {
        return { 'selectSomeSupplier': true };
      }
      else {
        for (let supplier of this.allSuppliers) {
          supplier.show = true
        }
      }
      if (check) {
        return { 'selectSomeSupplier': true };
      }
    }
  }

  valueChange(supplier: Suppliers, ch: MatCheckbox, i: number) {
    const sArr = this.supplierForm.controls["forms"] as FormArray;
    const sGrp = sArr.at(i) as FormGroup;
    if (ch.checked) {
      if (this.supplierCounter < 3) {
        this.supplierCounter++;
        supplier.checked = true
        sGrp.get("supplier").setValue(supplier);
      } else {
        this.notifier.snack("Cannot add more than 3 supplier");
        supplier.checked = false;
        ch.checked = false;
      }
    } else {
      this.supplierCounter--;
      sGrp.get("supplier").reset();
    }
  }

  supplierAlert() {
    this.notifier.snack("Cannot add more than 3 supplier");
  }

  reviewRfq() {
    this.supplierAdded();
    this.openRfqTermsDialog(this.rfqData);
  }

  supplierAdded() {
    this.rfqData.supplierId = this.supplierForm.value.forms.filter(supplier => {
      return supplier.supplier != null
    }).map(supplier => {
      return supplier.supplier.supplierId;
    })
  }

  changeRfq() {
    this.supplierAdded()
    this.updatedRfq.emit(this.rfqData);
  }

  openSupplierDialog(projectId) {
    let data = { projectId, countryList: this.countryist }

    const dialogRef = this.dialog.open(SuppliersDialogComponent, {
      width: "660px",
      data,
      panelClass: 'add-supplier-dialog'
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => {
        if (result === 'Supplier Successfully added') {
          let allSuppliersId: number[] = [];
          this.commonService.getSuppliers(this.orgId).then(data => {
            allSuppliersId = this.allSuppliers.map(supp => supp.supplierId);
            let tempId: number[] = data.data.supplierList.map(supp => supp.supplierId);
            let newAddedId: number = null
            tempId.forEach(id => {
              if (!allSuppliersId.includes(id)) {
                newAddedId = id;
              }
            });
            let newSupplier = data.data.supplierList.filter(supp => {
              return newAddedId === supp.supplierId
            })
            this.allSuppliers.push(...newSupplier);
            this.allSuppliers = JSON.parse(JSON.stringify(this.allSuppliers))
            this.formInit();
          });
        }
      });
  }

  openRfqTermsDialog(data: AddRFQ): void {
    const dialogRef = this.dialog.open(SelectRfqTermsComponent, {
      width: "400px",
      data,
      panelClass: ['common-modal-style', 'select-rfq-terms-dialog']
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  selectCurrency() {
    const dialogRef = this.dialog.open(SelectCurrencyComponent, {
      disableClose: true,
      width: "600px",
      data: this.rfqData ? this.rfqData.rfqCurrency : null,
      panelClass: ['common-modal-style', 'select-currency-dialog']
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data != null) {
        this.rfqData.rfqCurrency = data;
      }
    });
  }
}
