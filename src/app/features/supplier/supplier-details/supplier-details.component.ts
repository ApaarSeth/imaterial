import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatChipInputEvent, MatTableDataSource } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ProjectDetails,
  ProjectIds
} from "src/app/shared/models/project-details";
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { stringify } from "querystring";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  RfqMat,
  RfqMaterialResponse
} from "src/app/shared/models/RFQ/rfq-details";
import { AddAddressDialogComponent } from "src/app/shared/dialogs/add-address/address-dialog.component";
import { AddEditUserComponent } from 'src/app/shared/dialogs/add-edit-user/add-edit-user.component';
import { DeactiveUserComponent } from 'src/app/shared/dialogs/disable-user/disable-user.component';
import { UserService } from 'src/app/shared/services/userDashboard/user.service';
import { forEachChild } from 'typescript';
import { SuppliersDialogComponent } from 'src/app/shared/dialogs/add-supplier/suppliers-dialog.component';
import { Suppliers } from 'src/app/shared/models/RFQ/suppliers';
import { SupplierDetailsPopUpData, SupplierAdd, AllSupplierDetails } from 'src/app/shared/models/supplier';
import { DeactiveSupplierComponent } from 'src/app/shared/dialogs/disable-supplier/disable-supplier.component';
import { SupplierRoutingModule } from '../supplier-routing.module';

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
  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private router: Router,
    private ref: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit() { 
    this.getAllSupplier();
  }

  getAllSupplier(){
    this.rfqService.getSuppliers(1).then(data => {
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
      
      dialogRef.afterClosed().toPromise().then(data => {
         this.getAllSupplier();
        console.log("The dialog was closed");

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
      dialogRef.afterClosed().toPromise().then(data => {
         this.getAllSupplier();
        console.log("The dialog was closed");
      });
    }
  }


}
