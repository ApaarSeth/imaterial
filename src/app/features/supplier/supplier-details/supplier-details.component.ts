import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { AddAddressDialogComponent } from "src/app/shared/dialogs/add-address/address-dialog.component";
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { SuppliersDialogComponent } from 'src/app/shared/dialogs/add-supplier/suppliers-dialog.component';
import { SupplierDetailsPopUpData, SupplierAdd } from 'src/app/shared/models/supplier';
import { DeactiveSupplierComponent } from 'src/app/shared/dialogs/disable-supplier/disable-supplier.component';

// chip static data
export interface Fruit {
  name: string;
}


const ELEMENT_DATA: SupplierAdd[] =[];

@Component({
  selector: "supplier-details",
  templateUrl: "./supplier-details.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
})


export class SupplierDetailComponent implements OnInit {
   displayedColumns: string[] = ['suppliername', 'email', 'contactNo', 'pan','status','star'];
  displayedColumnsDeactivate : string[] = ['username', 'email', 'contactNo', 'roleName', 'ProjectList'];
   dataSource = ELEMENT_DATA;
   dataSourceActivate = ELEMENT_DATA;
   dataSourceDeactivate = ELEMENT_DATA;


   deactivateUsers: Array<SupplierAdd> = new Array<SupplierAdd>();
   activateUsers: Array<SupplierAdd> = new Array<SupplierAdd>();


   suppliersDetailsTemp :SupplierAdd = {};


   addUserBtn : boolean = false;
  orgId: number;
  constructor(
    public dialog: MatDialog,
    private rfqService: RFQService  ) {}

  ngOnInit() {
    this.orgId=Number(localStorage.getItem("orgId")) 
    this.getAllSupplier();
  }

  getAllSupplier(){
    this.rfqService.getSuppliers(this.orgId).then(data => {
          this.dataSource = data.data;
            if(this.dataSource.length>0){
              this.addUserBtn = false;
            } 
            else if(this.dataSource == null || this.dataSource.length==0){
              this.addUserBtn = true;
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
        width: "800px",
        data
      });
      
      dialogRef.afterClosed().toPromise().then(() => {
         this.getAllSupplier();

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
        width: "800px",
        data
      });
      dialogRef.afterClosed().toPromise().then(() => {
         this.getAllSupplier();
      });
    }
  }


}
