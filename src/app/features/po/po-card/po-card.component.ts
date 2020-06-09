import { Component, OnInit, Input, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ProjectAddress,
  SupplierAddress,
  CardData
} from "src/app/shared/models/PO/po-data";
import { MatDialog } from "@angular/material";
import { SelectApproverComponent } from "src/app/shared/dialogs/selectPoApprover/selectPo.component";
import { SelectPoRoleComponent } from "src/app/shared/dialogs/select-po-role/select-po-role.component";
import { AddAddressPoDialogComponent } from "src/app/shared/dialogs/add-address-po/add-addressPo.component";
import { Address } from "src/app/shared/models/RFQ/rfq-details";
import { ActivatedRoute } from "@angular/router";
import { POService } from 'src/app/shared/services/po/po.service';
import { CommonService } from 'src/app/shared/services/commonService';

@Component({
  selector: "app-po-card",
  templateUrl: "./po-card.component.html"
})
export class PoCardComponent implements OnInit {

  @Input("cardData") cardData: CardData;
  mode: string;
  projectDetails: FormGroup;
  isPoNoAndDateValid: boolean = false
  minDate = new Date();
  showResponsiveDesign: boolean;

  constructor(
    private poService: POService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.formInit();
    window.dispatchEvent(new Event('resize'));
    this.route.params.subscribe(params => {
      this.mode = params.mode;
    });
    this.cardData.projectAddress.projectUserId && this.poService.projectRole$.next();
    this.cardData.billingAddress.projectBillingUserId && this.poService.billingRole$.next();
    this.cardData.billingAddress.projectBillingAddressId && this.poService.billingAddress$.next();
    this.cardData.supplierAddress.supplierAddressId && this.poService.supplierAddress$.next();
    this.cardData.poNumber && this.poService.poNumber$.next()
  }

  ngOnChanges(): void {
  }

  formInit() {
    this.projectDetails = this.formBuilder.group({
      orderNo: [this.cardData.poNumber, Validators.required],
      openingDate: [],
      endDate: [this.cardData.poValidUpto],
      billingAddress: [this.cardData.billingAddress],
      projectAddress: [this.cardData.projectAddress],
      supplierAddress: [this.cardData.supplierAddress],
      projectId: []
    });
    this.projectDetails.valueChanges.subscribe((val) => {
      val.orderNo && this.poService.poNumber$.next();
    })
  }
  submit() {
  }

  getData() {
    if (this.projectDetails.get("endDate").value) {
      let date = new Date(this.commonService.formatDate(this.projectDetails.get("endDate").value))
      let dummyMonth = date.getMonth() + 1;
      const year = date.getFullYear().toString();
      const month = dummyMonth > 9 ? dummyMonth.toString() : "0" + dummyMonth.toString();
      const day = date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString();
      this.projectDetails.get("endDate").setValue(year + "-" + month + "-" + day)
    }
    return this.projectDetails.value;
  }

  openDialog(roleType: string, projectId: number) {
    const dialogRef = this.dialog.open(SelectPoRoleComponent, {
      width: "700px",
      data: { roleType, projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result[0] === "projectBillingUserId") {
          this.cardData.billingAddress.email = result[1].approver.email;
          this.cardData.billingAddress.contactNo = result[1].approver.contactNo;
          this.cardData.billingAddress.firstName = result[1].approver.firstName;
          this.cardData.billingAddress.lastName = result[1].approver.lastName;
          this.cardData.billingAddress.projectBillingUserId =
            result[1].approver.userId;
          result[1].approver.userId && this.poService.billingRole$.next();
          this.projectDetails.controls["billingAddress"].setValue(
            this.cardData.billingAddress
          );
        } else {
          this.cardData.projectAddress.email = result[1].approver.email;
          this.cardData.projectAddress.contactNo = result[1].approver.contactNo;
          this.cardData.projectAddress.firstName = result[1].approver.firstName;
          this.cardData.projectAddress.lastName = result[1].approver.lastName;
          this.cardData.projectAddress.projectUserId = result[1].approver.userId;
          result[1].approver.userId && this.poService.projectRole$.next();
          this.projectDetails.controls["projectAddress"].setValue(
            this.cardData.projectAddress
          );
        }
      }

    });
  }
  openaddressDialog(roleType: string, id: number) {
    const dialogRef = this.dialog.open(AddAddressPoDialogComponent, {
      width: "800px",
      data: { roleType, id }
    });

    dialogRef.afterClosed().subscribe((result: Address) => {
      if (result != null) {
        if (result[0] === "projectBillingAddressId") {
          this.cardData.billingAddress.addressLine1 =
            result[1].address.addressLine1;
          this.cardData.billingAddress.addressLine2 =
            result[1].address.addressLine2;
          this.cardData.billingAddress.city = result[1].address.city;
          this.cardData.billingAddress.state = result[1].address.state;
          this.cardData.billingAddress.pinCode = result[1].address.pinCode;
          this.cardData.billingAddress.projectBillingAddressId =
            result[1].address.projectAddressId;
          result[1].address.projectAddressId && this.poService.billingAddress$.next();
          this.cardData.billingAddress.gstNo = result[1].address.gstNo;
          this.projectDetails.controls["billingAddress"].setValue(
            this.cardData.billingAddress
          );
        } else {
          this.cardData.supplierAddress.addressLine1 =
            result[1].address.addressLine1;
          this.cardData.supplierAddress.addressLine2 =
            result[1].address.addressLine2;
          this.cardData.supplierAddress.city = result[1].address.city;
          this.cardData.supplierAddress.state = result[1].address.state;
          this.cardData.supplierAddress.pinCode = result[1].address.pinCode;
          this.cardData.supplierAddress.supplierAddressId =
            result[1].address.supplierAddressId;
          result[1].address.supplierAddressId && this.poService.supplierAddress$.next();
          this.cardData.supplierAddress.gstNo = result[1].address.gstNo;
          this.projectDetails.controls["supplierAddress"].setValue(
            this.cardData.supplierAddress
          );
        }
      }

    });
  }


  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (event.currentTarget.innerWidth <= 768) {
      this.showResponsiveDesign = true;
    } else {
      this.showResponsiveDesign = false;
    }
  }

}
