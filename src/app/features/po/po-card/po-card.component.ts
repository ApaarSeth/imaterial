import { Component, OnInit, Input, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  CardData
} from "src/app/shared/models/PO/po-data";
import { MatDialog } from "@angular/material/dialog";
import { SelectPoRoleComponent } from "src/app/shared/dialogs/select-po-role/select-po-role.component";
import { Address } from "src/app/shared/models/RFQ/rfq-details";
import { ActivatedRoute } from "@angular/router";
import { POService } from 'src/app/shared/services/po.service';
import { CommonService } from 'src/app/shared/services/commonService';
import { SupplierRatingComponent } from "src/app/shared/dialogs/supplier-rating/supplier-rating.component";
import { AddAddressDialogComponent } from "../../../shared/dialogs/add-address/add-address.component";

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
  rating: number;
  poId: number;
  userId: number;
  countryCode: string;
  constructor(
    private poService: POService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.userId = Number(localStorage.getItem("userId"));
    this.countryCode = localStorage.getItem('countryCode')
    if (this.cardData.poStatus === '3' && this.cardData.poCreatedBy === this.userId && (this.cardData.sellerPORating === null || this.cardData.sellerPORating === undefined)) {
      this.openSupplierRating();
    }
    window.dispatchEvent(new Event('resize'));
    this.route.params.subscribe(params => {
      this.poId = Number(params.id);
      this.mode = params.mode;
      this.formInit();
    });
    // this.cardData.projectAddress.projectUserId && this.poService.projectRole$.next();
    // this.cardData.billingAddress.projectBillingUserId && this.poService.billingRole$.next();
    // this.cardData.billingAddress.projectBillingAddressId && this.poService.billingAddress$.next();
    // this.cardData.supplierAddress.supplierAddressId && this.poService.supplierAddress$.next();
    // this.cardData.poNumber && this.poService.poNumber$.next()
  }

  ngOnChanges(): void {
  }

  formInit() {
    this.projectDetails = this.formBuilder.group({
      orderNo: [{ value: this.cardData.poNumber, disabled: this.mode === 'edit' ? false : true }, Validators.required],
      openingDate: [],
      endDate: [{ value: this.cardData.poValidUpto, disabled: this.mode === 'edit' ? false : true }],
      billingAddress: [this.cardData.billingAddress],
      projectAddress: [this.cardData.projectAddress],
      supplierAddress: [this.cardData.supplierAddress],
      projectUserId: [this.cardData.projectAddress.projectUserId, Validators.required],
      projectBillingUserId: [this.cardData.billingAddress.projectBillingUserId, Validators.required],
      projectBillingAddressId: [this.cardData.billingAddress.projectBillingAddressId, Validators.required],
      supplierAddressId: [this.cardData.supplierAddress.supplierAddressId, Validators.required],
      projectId: []
    });
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
    return this.projectDetails.getRawValue();
  }

  openDialog(roleType: string, projectId: number) {
    const dialogRef = this.dialog.open(SelectPoRoleComponent, {
      width: "700px",
      data: { roleType, projectId },
      panelClass: ['common-modal-style', 'select-contact-person-dialog']
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
          this.projectDetails.get('projectBillingUserId').setValue(result[1].approver.userId)
          // result[1].approver.userId && this.poService.billingRole$.next();
          this.projectDetails.controls["billingAddress"].setValue(
            this.cardData.billingAddress
          );
        } else {
          this.cardData.projectAddress.email = result[1].approver.email;
          this.cardData.projectAddress.contactNo = result[1].approver.contactNo;
          this.cardData.projectAddress.firstName = result[1].approver.firstName;
          this.cardData.projectAddress.lastName = result[1].approver.lastName;
          this.cardData.projectAddress.projectUserId = result[1].approver.userId;
          // result[1].approver.userId && this.poService.projectRole$.next();
          this.projectDetails.controls["projectAddress"].setValue(
            this.cardData.projectAddress
          );
          this.projectDetails.get('projectUserId').setValue(result[1].approver.userId)

        }
      }

    });
  }

  openaddressDialog(roleType: string, id: number) {
    let international = this.cardData.isInternational;
    const dialogRef = this.dialog.open(AddAddressDialogComponent, {
      width: "800px",
      data: { roleType, id, international },
      panelClass: ['common-modal-style', 'add-address-dialog']
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
          // result[1].address.projectAddressId && this.poService.billingAddress$.next();
          this.cardData.billingAddress.gstNo = result[1].address.gstNo === '' ? null : result[1].address.gstNo;
          this.projectDetails.controls["billingAddress"].setValue(
            this.cardData.billingAddress
          );
          this.projectDetails.controls["projectBillingAddressId"].setValue(
            result[1].address.projectAddressId);
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
          // result[1].address.supplierAddressId && this.poService.supplierAddress$.next();
          this.cardData.supplierAddress.gstNo = result[1].address.gstNo === '' ? null : result[1].address.gstNo;
          this.projectDetails.controls["supplierAddress"].setValue(
            this.cardData.supplierAddress
          );
          this.projectDetails.controls["supplierAddressId"].setValue(
            result[1].address.supplierAddressId);
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

  /**
   * @description function will call if rating selected or if clear button clicked
   * @param rating number of rating which selected
   */
  checkRating(rating: number): void {
    const data = {
      supplierId: this.cardData.supplierAddress.supplierId,
      rating,
      purchaseOrderId: this.poId
    }

    this.poService.submitSupplierRating(data).then(res => {
      this.cardData.sellerPORating = rating;
    });

    this.rating = rating;
  }

  /**
   * @description function to call and open the supplier rating dialog
   */
  openSupplierRating() {
    const dialogRef = this.dialog.open(SupplierRatingComponent, {
      disableClose: true,
      width: "500px",
      data: this.cardData.supplierAddress,
      panelClass: ['common-modal-style', 'vendor-rating-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'closed' || result === undefined) {
        this.checkRating(0);
      } else {
        this.checkRating(result);
      }
    });
  }
}