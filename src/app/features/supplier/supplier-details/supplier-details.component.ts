import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { GuidedTour, Orientation, GuidedTourService } from "ngx-guided-tour";
import { GlobalLoaderService } from "../../../shared/services/global-loader.service";
import { CommonService } from "../../../shared/services/commonService";
import { ActivatedRoute } from "@angular/router";
import { RFQService } from "../../../shared/services/rfq.service";
import { UserGuideService } from "../../../shared/services/user-guide.service"
import { DeactiveSupplierComponent } from "../../../shared/dialogs/disable-supplier/disable-supplier.component";
import { SupplierAdd, SupplierDetailsPopUpData } from "../../../shared/models/supplier";
import { SuppliersDialogComponent } from "../../../shared/dialogs/add-supplier/suppliers-dialog.component";



// chip static data
export interface Fruit {
  name: string;
}


const ELEMENT_DATA: SupplierAdd[] = [];

@Component({
  selector: "supplier-details",
  templateUrl: "./supplier-details.component.html"
})


export class SupplierDetailComponent implements OnInit {
  displayedColumns: string[] = ['suppliername', 'email', 'contactNo', 'status'];
  displayedColumnsDeactivate: string[] = ['username', 'email', 'contactNo', 'roleName', 'ProjectList'];
  dataSource = new MatTableDataSource<SupplierAdd>();
  dataSourceTemp = ELEMENT_DATA;
  dataSourceDeactivate = ELEMENT_DATA;
  @ViewChild('fileDropRef', { static: false }) myInputVariable: ElementRef;
  deactivateUsers: Array<SupplierAdd> = new Array<SupplierAdd>();
  activateUsers: Array<SupplierAdd> = new Array<SupplierAdd>();


  suppliersDetailsTemp: SupplierAdd = {};


  addUserBtn: boolean = false;
  orgId: number;
  countryList: any;

  isMobile: boolean;

  public SupplierDashboardTour: GuidedTour = {
    tourId: 'supplier-tour',
    useOrb: false,

    steps: [
      {
        title: 'Add Suppliers',
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
  showResponsiveDesignIcons: boolean;

  constructor(
    public dialog: MatDialog,
    private rfqService: RFQService,
    private loading: GlobalLoaderService,
    private guidedTourService: GuidedTourService,
    private _snackBar: MatSnackBar,
    private userGuideService: UserGuideService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.userId = Number(localStorage.getItem("userId"));
    this.countryList = this.activatedRoute.snapshot.data.countryList;
    this.isMobile = this.commonService.isMobile().matches;
    window.dispatchEvent(new Event('resize'));
    this.getNotifications();
    this.getAllSupplier();
  }

  getNotifications() {
    this.commonService.getNotification(this.userId);
  }
  getAllSupplier() {
    this.commonService.getSuppliers(this.orgId).then(data => {
      this.dataSource = new MatTableDataSource(data.data);

      this.dataSourceTemp = data.data;

      if ((localStorage.getItem('supplier') == "null") || (localStorage.getItem('supplier') == '0')) {
        setTimeout(() => {
          this.guidedTourService.startTour(this.SupplierDashboardTour);
        }, 1000);
      }

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
      isDelete: false,
      countryList: this.countryList
    } as SupplierDetailsPopUpData);
  }

  openDialog(data: SupplierDetailsPopUpData): void {
    const dialogRef = this.dialog.open(SuppliersDialogComponent, {
      width: "660px",
      data
    });

    dialogRef.afterClosed().toPromise().then((data) => {
      if (data && data != null) {
        this.getAllSupplier();
      }
    });

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
    const popovers = {
      "userId": this.userId,
      "moduleName": "supplier",
      "enableGuide": 1
    };
    this.userGuideService.sendUserGuideFlag(popovers).then(res => {
      if (res) {
        localStorage.setItem('supplier', '1');
      }
    })
  }

  openDialogDeactiveUser(data: SupplierDetailsPopUpData): void {
    const dialogRef = this.dialog.open(DeactiveSupplierComponent, {
      width: "500px",
      data
    });
    dialogRef.afterClosed().toPromise().then((data) => {
      if (data && data != null) {
        this.getAllSupplier();
      }
    });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  uploadExcel(files: FileList) {
    const data = new FormData();
    data.append("file", files[0]);
    var fileSize = files[0].size; // in bytes
    if (fileSize < 5000000) {
      this.postSupplierExcel(data);
    }
    else {
      this._snackBar.open("File must be less than 5 mb", "", {
        duration: 2000,
        panelClass: ["success-snackbar"],
        verticalPosition: "bottom"
      });
    }
  }

  postSupplierExcel(data) {
    this.loading.show();
    this.rfqService.postSupplierExcel(data, this.orgId).then(res => {
      if (res.statusCode === 201) {
        this._snackBar.open(res.message, "", {
          duration: 2000,
          panelClass: ["success-snackbar"],
          verticalPosition: "bottom"
        });
        this.myInputVariable.nativeElement.value = ""
        this.getAllSupplier();
        this.loading.hide();
      }
      else {
        this._snackBar.open(res.message, "", {
          duration: 5000,
          panelClass: ["success-snackbar"],
          verticalPosition: "bottom"
        });
        this.loading.hide();
      }
    }).catch(err => {
      this.myInputVariable.nativeElement.value = "";
      this._snackBar.open(err.error.message, "", {
        duration: 5000,
        panelClass: ["success-snackbar"],
        verticalPosition: "bottom"
      });
      this.loading.hide();
    });
  }

  downloadExcel(url: string) {
    var win = window.open(url, "_blank");
    win.focus();
  }
  @HostListener('window:resize', ['$event'])

  sizeChange(event) {
    if (event.currentTarget.innerWidth <= 1025) {
      this.showResponsiveDesignIcons = true;
    } else {
      this.showResponsiveDesignIcons = false;
    }

  }
}