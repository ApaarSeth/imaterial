import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatTableDataSource, MatDialogRef, MatSnackBar } from "@angular/material";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { AddAddressDialogComponent } from "src/app/shared/dialogs/add-address/address-dialog.component";
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { SuppliersDialogComponent } from 'src/app/shared/dialogs/add-supplier/suppliers-dialog.component';
import { SupplierDetailsPopUpData, SupplierAdd } from 'src/app/shared/models/supplier';
import { DeactiveSupplierComponent } from 'src/app/shared/dialogs/disable-supplier/disable-supplier.component';
import { GlobalLoaderService } from 'src/app/shared/services/global-loader.service';
import { GuidedTourService, GuidedTour, Orientation } from 'ngx-guided-tour';
import { UserGuideService } from 'src/app/shared/services/user-guide/user-guide.service';
import { CommonService } from 'src/app/shared/services/commonService';

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
  displayedColumns: string[] = ['suppliername', 'email', 'contactNo', 'status', 'star'];
  displayedColumnsDeactivate: string[] = ['username', 'email', 'contactNo', 'roleName', 'ProjectList'];
  dataSource = new MatTableDataSource<SupplierAdd>();
  dataSourceTemp = ELEMENT_DATA;
  dataSourceDeactivate = ELEMENT_DATA;


  deactivateUsers: Array<SupplierAdd> = new Array<SupplierAdd>();
  activateUsers: Array<SupplierAdd> = new Array<SupplierAdd>();


  suppliersDetailsTemp: SupplierAdd = {};


  addUserBtn: boolean = false;
  orgId: number;

     public SupplierDashboardTour: GuidedTour = {
        tourId: 'supplier-tour',
        useOrb: false,
        
        steps: [
            {
              title:'Add Suppliers',
              selector: '.add-supplier-button',
              content: 'Click here to onboard the supplier.',
              orientation: Orientation.Left
            }
        ],
      skipCallback: () => {
      this.setLocalStorage()
    },
    completeCallback: () => {
      this.setLocalStorage()
    }
    };
  userId: number;

  constructor(
    public dialog: MatDialog,
    private rfqService: RFQService,
      private loading: GlobalLoaderService,
      private guidedTourService: GuidedTourService,
      private _snackBar: MatSnackBar,
      private userGuideService: UserGuideService,
      private commonService : CommonService
  ) {
  }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
     if ((localStorage.getItem('supplier') == "null") || (localStorage.getItem('supplier') == '0')) {
      setTimeout(() => {
        this.guidedTourService.startTour(this.SupplierDashboardTour);
      }, 1000);
    }
    this.getNotifications();
    this.getAllSupplier();
  }

 getNotifications(){
    this.commonService.getNotification(this.userId);
  }
  getAllSupplier() {
    this.rfqService.getSuppliers(this.orgId).then(data => {

      this.dataSource = new MatTableDataSource(data.data);
      this.dataSourceTemp = data.data;

      // this.dataSource.filterPredicate = (data, filterValue) => {
      //   const dataStr = data.supplier_name.toString() + data.email.toString() + data.pan.toString() + data.contact_no.toString() + data.status;
      //   return dataStr.indexOf(filterValue) != -1;
      // }
      
       this.dataSource.filterPredicate = (data, filterValue) => {
        const dataStr =
          data.supplier_name.toString().toLowerCase() +
          data.email.toString().toLowerCase() +
          data.contact_no.toString();
        return dataStr.indexOf(filterValue) != -1;
      };
      
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
        if(data && data!=null){
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
    setLocalStorage() {
    const popovers ={
    "userId":this.userId,
    "moduleName":"supplier",
    "enableGuide":1
};
    this.userGuideService.sendUserGuideFlag(popovers).then(res=>{
      if(res){
         localStorage.setItem('supplier', '1');
      }
    })
  }

  openDialogDeactiveUser(data: SupplierDetailsPopUpData): void {
    if (AddAddressDialogComponent) {
      const dialogRef = this.dialog.open(DeactiveSupplierComponent, {
        width: "500px",
        data
      });
      dialogRef.afterClosed().toPromise().then((data) => {
        if(data && data!=null){
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
      if(res){
            this._snackBar.open(res.message, "", {
              duration: 2000,
              panelClass: ["success-snackbar"],
              verticalPosition: "top"
            });
             this.getAllSupplier();
            this.loading.hide();
      }
    });
  }

  downloadExcel(url: string) {
    var win = window.open(url, "_blank");
    win.focus();
  }
}