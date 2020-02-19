import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import {
  RfqMaterialResponse,
  AddRFQ,
  RfqMat
} from "src/app/shared/models/RFQ/rfq-details";
import { ActivatedRoute } from "@angular/router";
import { MatStepper } from "@angular/material";
import { FormBuilder } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { RfqQuantityMakesComponent } from "./rfq-quantity-makes/rfq-quantity-makes.component";

@Component({
  selector: "app-create-rfq",
  templateUrl: "./create-rfq.component.html"
})
export class CreateRfqComponent implements OnInit {
  @ViewChild("stepper", { static: true, read: MatStepper })
  @ViewChild("qtyMakes", { static: true })
  qtyMakes: RfqQuantityMakesComponent;
  stepper: MatStepper;
  updatedRfqMaterial: AddRFQ;
  rfqMaterial: AddRFQ;
  stpForm: any;
  prevIndex: any;
  currentIndex = 0;
  rfqData: AddRFQ;
  finalRfq: AddRFQ;
  completed: boolean = false;
  constructor(
    private rfqService: RFQService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (this.stepper) {
        this.stepper.selectedIndex = params.selectedIndex - 1;
        this.currentIndex = params.selectedIndex - 1;
      }
    });

    this.stpForm = this.formBuilder.group({
      mat: [],
      qty: []
    });
  }

  getQuantityAndMakes(updatedMaterials: AddRFQ) {
    this.updatedRfqMaterial = updatedMaterials;
    if (this.qtyMakes.getFormStatus().status !== "INVALID") {
      this.completed = true;
    }
  }

  getMaterial(materials: AddRFQ) {
    this.rfqMaterial = materials;
  }
  selectionChange(event) {
    this.currentIndex = event.selectedIndex;
    this.prevIndex = event.previouslySelectedIndex;
    if (event.previouslySelectedIndex === 1) {
      this.rfqData = this.updatedRfqMaterial;
      // this.stpForm.get("mat").setValue(this.stpForm.get("qty").value)
    }
    if (event.previouslySelectedIndex === 0 && event.selectedIndex === 1) {
      this.completed = false;
      this.rfqService.addRFQ(this.rfqMaterial).then(res => {
        // this.currentIndex = event.selectedIndex;
        // this.stpForm.get("mat").setValue(res.data);
        this.rfqMaterial = res.data;
        // console.log("mat", this.stpForm.get("mat").value);
      });
      if (this.qtyMakes.getFormStatus().status !== "INVALID") {
        this.completed = true;
      }
    } else if (
      event.selectedIndex === 2 &&
      event.previouslySelectedIndex === 1
    ) {
      this.rfqService.addRFQ(this.updatedRfqMaterial).then(res => {
        this.currentIndex = event.selectedIndex;
        this.finalRfq = res.data;
        // this.stpForm.get("qty").setValue(res.data);
        // console.log("selected mat", this.stpForm.get("qty").value);
      });
    } else if (event.previouslySelectedIndex == 2) {
      this.rfqService.addRFQ(this.updatedRfqMaterial).then(res => {
        this.currentIndex = event.selectedIndex;
        this.rfqMaterial = res.data;
        this.stpForm.get("qty").setValue(res.data);
        console.log("selected mat", this.stpForm.get("qty").value);
      });
    } else if (event.selectedIndex === 1) {
      if (this.qtyMakes.getFormStatus()) {
        this.completed = true;
      }
    }
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }
}
