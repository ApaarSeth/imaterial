import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SendRfqObj } from "src/app/shared/models/RFQ/rfq-details-supplier";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { MatDialog } from '@angular/material';
import { ConfirmRfqBidComponent } from 'src/app/shared/dialogs/confirm-rfq-bid/confirm-frq-bid-component';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { POService } from 'src/app/shared/services/po/po.service';
import { SupplierAddress, SupplierSelectedAddress } from 'src/app/shared/models/PO/po-data';
import { FieldRegExConst } from 'src/app/shared/constants/field-regex-constants';
import { ProjectService } from 'src/app/shared/services/projectDashboard/project.service';
import { SelectSupplierAddressDialogComponent } from 'src/app/shared/dialogs/select-supplier-address/select-supplier-address.component';
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
  selectedAddress: any;
  AddressValid: boolean;

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
       if(this.supplierAddress && this.supplierAddress.data.length < 2 && this.supplierAddress.data[0].supplierAddressId == 0){
               this.AddressValid = false;
            }
            else{
               this.AddressValid = true;
            }

      if(this.supplierAddress && this.supplierAddress.data[0].supplierAddressId == 0 || this.supplierAddress.data[0].addressId == null || this.supplierAddress.data[0].addressId == ""){
 
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

    this.form = this.formBuilder.group({
      
      supplierName: [
        { value : this.supplierAddress.data ? this.supplierAddress.data[0].supplier_name : "", disabled:true}
      ],
      contactNo: [
        {value : this.supplierAddress.data ? this.supplierAddress.data[0].contact_no : "", disabled:true}
      ],
      email: [
        {value : this.supplierAddress.data ? this.supplierAddress.data[0].email : "",disabled:true}
      ],

      addressLine1: [
        {value :  (this.selectedAddress && this.selectedAddress.addressLine1) ?  this.selectedAddress.addressLine1 : "", disabled : false}
      ],
      addressLine2: [{ value : ( this.selectedAddress && this.selectedAddress.addressLine2) ?  this.selectedAddress.addressLine2 : "", disabled: false}],
      pinCode: [
        {value :  ( this.selectedAddress && this.selectedAddress.pinCode) ? this.selectedAddress.pinCode : "", disabled:false},
        [Validators.required,Validators.pattern(FieldRegExConst.PINCODE)]
      ],
      state: [
        {value: ( this.selectedAddress && this.selectedAddress.state) ? this.selectedAddress.state : "",disabled:true},
        Validators.required
      ],
      city: [
        {value: ( this.selectedAddress && this.selectedAddress.city) ? this.selectedAddress.city : "",disabled:true},
        Validators.required
      ],
      gstNo: [
        {value : ( this.selectedAddress && this.selectedAddress.gstNo) ? this.selectedAddress.gstNo : "",disabled:false},
        [Validators.required, Validators.pattern(FieldRegExConst.GSTIN)]
      ]
    });

   if(this.form.value.pinCode)
    this.validPincode = true;
  }

  saveAddress() {
    this.openDialog();
  }
  getPincode(event){
        this.validPincode = false;
        this.city = "";
        this.state = "";
        this.form.get('city').setValue("");
        this.form.get('state').setValue("");
        this.pincodeLength = event.target.value.length;
        
     if (event.target.value.length == 6) {
         this.getCityAndState(event.target.value);
     }

}
getCityAndState(pincode){
  this.projectService.getPincode(pincode).then(res =>{
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

  openDialog(): void {
      if(this.city && this.state){
          this.form.value.city = this.city;
          this.form.value.state = this.state;
      }
       
      //console.log(this.form.value);
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
        }
        if (data.data == "submit") {
          this.router.navigate([
            "rfq-bids/finish/" + this.brandCount + "/" + this.materialCount]);
        }*/
      });
  }

  openAddressDialog(): void {
    if(this.AddressValid){
        const dialogRef = this.dialog.open(SelectSupplierAddressDialogComponent, {
      data: {  supplierAddresses: this.supplierAddress },
      width: "800px"
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(res => {
          console.log(res.data);
          this.supplierAddress.data.forEach(element => {
            if(element.addressId == res.data){
              this.selectedAddress = element;
              this.getCityAndState(element.pinCode);
            }
          });
          this.initForm();
      });
    }
  
  }
  reset(){
    this.form.controls.addressLine1.setValue(null);
  //  this.form.controls.addressLine1.setErrors(null);
  
    this.form.controls.addressLine2.setValue(null);
    this.form.controls.addressLine2.setErrors(null);
    
    this.form.controls.pinCode.setValue(null);
  //  this.form.controls.pinCode.setErrors(null);

    this.form.controls.state.setValue(null);
    this.form.controls.state.setErrors(null);

    this.form.controls.city.setValue(null);
    this.form.controls.city.setErrors(null);

    this.form.controls.gstNo.setValue(null);
   // this.form.controls.gstNo.setErrors(null);
    
  }
}