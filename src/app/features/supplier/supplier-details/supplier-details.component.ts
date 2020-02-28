import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { AddAddressDialogComponent } from "src/app/shared/dialogs/add-address/address-dialog.component";
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { SuppliersDialogComponent } from 'src/app/shared/dialogs/add-supplier/suppliers-dialog.component';
import { SupplierDetailsPopUpData, SupplierAdd } from 'src/app/shared/models/supplier';
import { DeactiveSupplierComponent } from 'src/app/shared/dialogs/disable-supplier/disable-supplier.component';
import { GlobalLoaderService } from 'src/app/shared/services/global-loader.service';

// chip static data
export interface Fruit {
  name: string;
}


const ELEMENT_DATA: SupplierAdd[] = [];

@Component({
  selector: "supplier-details",
  templateUrl: "./supplier-details.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})


export class SupplierDetailComponent implements OnInit {
  displayedColumns: string[] = ['suppliername', 'email', 'contactNo', 'pan', 'status', 'star'];
  displayedColumnsDeactivate: string[] = ['username', 'email', 'contactNo', 'roleName', 'ProjectList'];
  dataSource = new MatTableDataSource<SupplierAdd>();
  dataSourceTemp = ELEMENT_DATA;
  dataSourceDeactivate = ELEMENT_DATA;


  deactivateUsers: Array<SupplierAdd> = new Array<SupplierAdd>();
  activateUsers: Array<SupplierAdd> = new Array<SupplierAdd>();


  suppliersDetailsTemp: SupplierAdd = {};


  addUserBtn: boolean = false;
  orgId: number;
  constructor(
    public dialog: MatDialog,
    private rfqService: RFQService,
    private loading: GlobalLoaderService) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"))
    this.getAllSupplier();
  }

  getAllSupplier() {
    this.rfqService.getSuppliers(this.orgId).then(data => {

      this.dataSource = new MatTableDataSource(data.data);
      this.dataSourceTemp = data.data;

      this.dataSource.filterPredicate = (data, filterValue) => {
        const dataStr = data.supplier_name + data.email + data.pan.toString() + data.contact_no.toString() + data.status;
        return dataStr.indexOf(filterValue) != -1;
      }

    });
  }

  addSupplier() {
    this.openDialog({
      isEdit: false,
      isDelete: false
    } as SupplierDetailsPopUpData);
  }

  openDialog(data: SupplierDetailsPopUpData): void {
    if (AddAddressDialogComponent) {
      const dialogRef = this.dialog.open(SuppliersDialogComponent, {
        width: "660px",
        data
      });

      dialogRef.afterClosed().toPromise().then((data) => {
        if(data){
          this.getAllSupplier();
        }
      });
    }
  }

  deactivateUser(data) {
    this.suppliersDetailsTemp.supplierId = data.supplierId;
    this.openDialogDeactiveUser({
      isEdit: false,
      isDelete: true,
      detail: this.suppliersDetailsTemp
    } as SupplierDetailsPopUpData);
  }

  openDialogDeactiveUser(data: SupplierDetailsPopUpData): void {
    if (AddAddressDialogComponent) {
      const dialogRef = this.dialog.open(DeactiveSupplierComponent, {
        width: "500px",
        data
      });
      dialogRef.afterClosed().toPromise().then(res => {
        if(res === undefined){
          this.getAllSupplier();
        }
      });
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  uploadExcel(files: FileList) {
    this.loading.show();
    const data = new FormData();
    data.append("file", files[0]);
    this.rfqService.postSupplierExcel(data, this.orgId).then(res => {
      this.getAllSupplier();
      this.loading.hide();
    });
  }

  downloadExcel(url: string) {
    var win = window.open(url, "_blank");
    win.focus();
  }
}