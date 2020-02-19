import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SendRfqObj } from "src/app/shared/models/RFQ/rfq-details-supplier";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { MatDialog } from '@angular/material';
import { ConfirmRfqBidComponent } from 'src/app/shared/dialogs/confirm-rfq-bid/confirm-frq-bid-component';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { POService } from 'src/app/shared/services/po/po.service';
import { SupplierAddress } from 'src/app/shared/models/PO/po-data';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
@Component({
  selector: "rfq-supplier-add-address",
  templateUrl: "./rfq-supplier-add-address.component.html"
})
export class RFQSupplierAddAddressComponent implements OnInit {

  materialCount: number = 0;
  brandCount: number = 0;
  rfqSupplierObj: SendRfqObj;

  supplierAddress: SupplierAddress;
  supplierId: number;
  form: FormGroup;
  materialForms: FormGroup;

  constructor(
        public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
     private formBuilder: FormBuilder,
     private poService: POService,
     private router:Router
  ) {}

  ngOnInit() {
     this.rfqSupplierObj = history.state.rfqSupplierObj;
     this.supplierId = history.state.supplierId;

      this.brandCount = this.activatedRoute.snapshot.params["brandList"];
      this.materialCount =  this.activatedRoute.snapshot.params["MaterialList"];


     console.log(this.rfqSupplierObj);
     this.poService.getSupplierAddress(this.supplierId).then(data => {
       this.supplierAddress = data.data;
        this.initForm();
     })
    
  }

 initForm() {

       this.form = this.formBuilder.group({
      supplierName: [
        this.supplierAddress[0].supplierName ? this.supplierAddress[0].supplierName : "",
        Validators.required
      ],
       contactNo: [
        this.supplierAddress[0].contactNo ? this.supplierAddress[0].contactNo : "",
        [Validators.required,Validators.pattern(FieldRegExConst.PHONE)]
      ],
       email: [
        this.supplierAddress[0].email ? this.supplierAddress[0].email : "",
         [Validators.required,Validators.pattern(FieldRegExConst.EMAIL)]
      ],

      addressLine1: [
        this.supplierAddress[0].addressLine1 ? this.supplierAddress[0].addressLine1 : "",
        Validators.required
      ],
      addressLine2: [this.supplierAddress[0].addressLine2 ? this.supplierAddress[0].addressLine2 : ""],
      pinCode: [
        this.supplierAddress[0].pinCode ? this.supplierAddress[0].pinCode : "",
        [Validators.required,Validators.pattern(FieldRegExConst.PINCODE)]
      ],
      state: [
        this.supplierAddress[0].state ? this.supplierAddress[0].state : "",
        Validators.required
      ],
      city: [
        this.supplierAddress[0].city ? this.supplierAddress[0].city : "",
        Validators.required
      ],
      gstNo: [
        this.supplierAddress[0].gstNo ? this.supplierAddress[0].gstNo : "",
        [Validators.required,Validators.pattern(FieldRegExConst.GSTIN)]
      ]
    });

  }

   saveAddress(){
    console.log(this.form.value);
    this.poService.addAddress(this.supplierId,this.form.value).then(res=>{
      if(res.data){
          this.openDialog(this.rfqSupplierObj);
      }
    })
  }

   openDialog(rfqSupplierObj): void {
    const dialogRef = this.dialog.open(ConfirmRfqBidComponent, {
      width: "800px"
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(data => {
        if (data.data == "close") {
          console.log("The dialog was closed");
        }
        if (data.data == "submit") {
         // this.submitBid(rfqSupplierObj);
          console.log("The dialog was submitted");
           this.router.navigate([
          "rfq-bids/finish/" + this.brandCount + "/" + this.materialCount]);


        }
      });
  }
}