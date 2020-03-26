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
import { ProjectService } from 'src/app/shared/services/projectDashboard/project.service';
@Component({
  selector: "rfq-supplier-add-address",
  templateUrl: "./rfq-supplier-add-address.component.html"
})
export class RFQSupplierAddAddressComponent implements OnInit {

  materialCount: number = 0;
  brandCount: number = 0;
  rfqSupplierObj: SendRfqObj;
  supplierAddress: any;
  supplierId: number;
  form: FormGroup;
  materialForms: FormGroup;
  city: string;
  state: string;
  pincodeLength: number;
  validPincode: boolean;
  addSupplierAddress: boolean;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private formBuilder: FormBuilder,
    private poService: POService,
    private router: Router,
    private projectService: ProjectService
  ) { }

  ngOnInit() {

    this.rfqSupplierObj = history.state.rfqSupplierObj;
    this.supplierId = history.state.supplierId;
    this.brandCount = this.activatedRoute.snapshot.params["brandList"];
    this.materialCount = this.activatedRoute.snapshot.params["MaterialList"];

    this.poService.getSupplierAddress(this.supplierId).then(data => {
    
      this.supplierAddress = data;
      if(this.supplierAddress.data[0].supplierAddressId == 0 || this.supplierAddress.data[0].addressId == null || this.supplierAddress.data[0].addressId == ""){

            this.addSupplierAddress = false;
            this.initForm();
            
             this.form.controls.supplierName.setValidators([Validators.required]);
             this.form.controls.supplierName.updateValueAndValidity();

             this.form.controls.contactNo.setValidators([Validators.required, Validators.pattern(FieldRegExConst.PHONE)]);
             this.form.controls.contactNo.updateValueAndValidity();

            this.form.controls.email.setValidators([Validators.required,Validators.pattern(FieldRegExConst.EMAIL)]);
            this.form.controls.email.updateValueAndValidity();
          
           this.form.controls.contactNo.setValidators([Validators.required, Validators.pattern(FieldRegExConst.PHONE)]);
           this.form.controls.contactNo.updateValueAndValidity();

           this.form.controls.addressLine1.setValidators([Validators.required]);
           this.form.controls.addressLine1.updateValueAndValidity();

           this.form.controls.pinCode.setValidators([Validators.required,Validators.pattern(FieldRegExConst.PINCODE)]);
           this.form.controls.pinCode.updateValueAndValidity();

           this.form.controls.state.setValidators([Validators.required]);
           this.form.controls.state.updateValueAndValidity();

           this.form.controls.city.setValidators([Validators.required]);
           this.form.controls.city.updateValueAndValidity();

            this.form.controls.gstNo.setValidators([Validators.required,Validators.pattern(FieldRegExConst.GSTIN)]);
            this.form.controls.gstNo.updateValueAndValidity();

      }else{
        this.addSupplierAddress = true;
        this.initForm();
      }
      
    })

  }

  initForm() {

    console.log(this.supplierAddress);
    this.form = this.formBuilder.group({
      
      supplierName: [
        { value : this.supplierAddress.data ? this.supplierAddress.data[0].supplier_name : "", disabled:this.addSupplierAddress}
      ],
      contactNo: [
        {value : this.supplierAddress.data ? this.supplierAddress.data[0].contact_no : "", disabled:this.addSupplierAddress}
      ],
      email: [
        {value : this.supplierAddress.data ? this.supplierAddress.data[0].email : "",disabled:this.addSupplierAddress}
      ],

      addressLine1: [
        {value : this.supplierAddress.data ? this.supplierAddress.data[0].addressLine1 : "", disabled : this.addSupplierAddress}
      ],
      addressLine2: [{ value : this.supplierAddress.data ? this.supplierAddress.data[0].addressLine2 : "", disabled: this.addSupplierAddress}],
      pinCode: [
        {value : this.supplierAddress.data ? this.supplierAddress.data[0].pinCode : "", disabled:this.addSupplierAddress}
      ],
      state: [
        {value:this.supplierAddress.data ? this.supplierAddress.data[0].state : "",disabled:true},
        Validators.required
      ],
      city: [
        {value:this.supplierAddress.data ? this.supplierAddress.data[0].city : "",disabled:true},
        Validators.required
      ],
      gstNo: [
        {value : this.supplierAddress.data ? this.supplierAddress.data[0].gstNo : "",disabled:this.addSupplierAddress}
      ]
    });

   if(this.form.value.pinCode)
    this.validPincode = true;
  }

  saveAddress() {
    this.openDialog();
    // this.openDialog(this.rfqSupplierObj, this.form.value);
    console.log(this.form.value);
    console.log(this.rfqSupplierObj);
    
    // this.poService.addAddress(this.supplierId, this.form.value).then(res => {
    //   if (res.data) {
    //     this.openDialog(this.rfqSupplierObj);
    //   }
    // })
  }
  getPincode(event){
        this.validPincode = false;
        this.city = "";
        this.state = "";
        this.form.get('city').setValue("");
        this.form.get('state').setValue("");
        this.pincodeLength = event.target.value.length;
        
     if (event.target.value.length == 6) {
         this.projectService.getPincode(event.target.value).then(res =>{
           if(res.data){
             this.city = res.data[0].districtName;
             this.state = res.data[0].stateName;
           if(this.city && this.state)
            this.validPincode = true;
          else
            this.validPincode = false;
             this.form.get('city').setValue(res.data[0].districtName);
             this.form.get('state').setValue(res.data[0].stateName);
           }
         });
     }

}

  openDialog(): void {

    if(!this.addSupplierAddress){
      this.form.value.city = this.city;
       this.form.value.state = this.state;
    }
       

    const dialogRef = this.dialog.open(ConfirmRfqBidComponent, {
      data: { rfqSupplierData: this.rfqSupplierObj, supplierAddress: this.form.value, supplierId: this.supplierId },
      width: "800px"
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(data => {
        if(data[0].statusCode === 201){
          this.router.navigate(["/rfq-bids/finish/" + this.brandCount + "/" + this.materialCount]);
        }
        /*if (data.data == "close") {
          console.log("The dialog was closed");
        }
        if (data.data == "submit") {
          console.log("The dialog was submitted");
          this.router.navigate([
            "rfq-bids/finish/" + this.brandCount + "/" + this.materialCount]);
        }*/
      });
  }
}