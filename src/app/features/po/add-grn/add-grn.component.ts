import { Component, OnInit } from "@angular/core";
import { GRNDetails } from 'src/app/shared/models/grn';
import { ActivatedRoute, Router } from '@angular/router';
import { GRNService } from 'src/app/shared/services/grn/grn.service';
import { Validators, FormArray, FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: "add-grn",
  templateUrl: "./add-grn.component.html"
  // ,styleUrls: ["/../../../../assets/scss/main.scss"]
})


export class AddGRNComponent implements OnInit {

  grnDetails: GRNDetails;
  grnId: number;
  dataSource: GRNDetails[];

  displayedColumns: string[] = [
    "Material Name",
    "Brand Name",
    "Awarded Quantity",
    "Delivered Quantity",
    "Received Quantity"
  ];
  materialForms: FormGroup;
  orgId: number;
  purchaseOrderId: any;

  constructor(private activatedRoute: ActivatedRoute, private grnService: GRNService,
    private formBuilder: FormBuilder, private route: Router) { }

  ngOnInit() {
    this.dataSource = this.activatedRoute.snapshot.data.viewGRN;
    this.purchaseOrderId = this.activatedRoute.params["poId"];
    this.formsInit();
  }

  formsInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    const frmArr = this.dataSource.map(data => {
      return new FormGroup({
        materialName: new FormControl(data.materialName),
        materialBrand: new FormControl(data.materialBrand),
        certifiedQty: new FormControl(data.certifiedQty ? data.certifiedQty : ""),
        materialId: new FormControl(data.materialId),
        deliveredQty: new FormControl(data.deliveredQty),
        awardedQty: new FormControl(data.awardedQty),
        deliveredDate: new FormControl(data.deliveredDate),
        grnId: new FormControl(data.grnId),
        grnDetailId: new FormControl(data.grnDetailId),
        purchaseOrderId: new FormControl(data.purchaseOrderId),
        organizationId: new FormControl(this.orgId)
      });
    });
    this.materialForms = this.formBuilder.group({
      forms: new FormArray(frmArr)
    });
  }

  postGRNDetails(grnDetailsObj: GRNDetails[]) {
    this.grnService.addGRN(grnDetailsObj).then(data => {
      this.route.navigate(['po/detail-list']);
    })
  }


  // getGRNDetails(grnId: number) {
  //     this.grnService.getGRNDetails(grnId).then(data => {
  //         console.log("grn data", data.data);
  //         this.grnDetails = data.data;
  //         this.grnDetailsObj = data.data;
  //         this.formsInit(this.grnDetailsObj);

  //     });
  // }

  addGrn() {
    const formValues: GRNDetails[] = [];
    this.materialForms.value.forms.forEach(element => {
      if (element.certifiedQty > 0) {
        formValues.push(element);
      }
    });
    this.postGRNDetails(formValues);
  }

  goBack() {
    this.route.navigate(['po/detail-list']);
  }
}