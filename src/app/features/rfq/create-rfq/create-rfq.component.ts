import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import {
  RfqMaterialResponse,
  AddRFQ
} from "src/app/shared/models/RFQ/rfq-details";
import { ActivatedRoute } from "@angular/router";
import { MatStepper } from "@angular/material";
import { FormBuilder } from "@angular/forms";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";

@Component({
  selector: "app-create-rfq",
  templateUrl: "./create-rfq.component.html"
})
export class CreateRfqComponent implements OnInit {
  @ViewChild("stepper", { static: true, read: MatStepper })
  stepper: MatStepper;
  updatedRfqMaterial: AddRFQ;
  rfqMaterial: AddRFQ;
  stpForm: any;
  prevIndex: any;
  currentIndex = 0;
  rfqData: AddRFQ;

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
  }
  getMaterial(materials: AddRFQ) {
    this.rfqMaterial = materials;
  }
  selectionChange(event) {
    this.prevIndex = event.previouslySelectedIndex;

    console.log(event);
    if (event.selectedIndex === 2) {
      console.log("selected qty", this.stpForm.get("qty").value);
    }
    if (event.previouslySelectedIndex === 1) {
      this.rfqData = this.stpForm.get("qty").value;
      // this.stpForm.get("mat").setValue(this.stpForm.get("qty").value)
    }
    if (event.previouslySelectedIndex === 0) {
      this.rfqService.addRFQ(this.stpForm.get("mat").value).then(res => {
        this.currentIndex = event.selectedIndex;
        this.stpForm.get("mat").setValue(res.data);
        console.log("mat", this.stpForm.get("mat").value);
      });
    } else if (event.selectedIndex === 2) {
      this.rfqService.addRFQ(this.stpForm.get("qty").value).then(res => {
        this.currentIndex = event.selectedIndex;
        this.stpForm.get("qty").setValue(res.data);
        console.log("selected mat", this.stpForm.get("qty").value);
      });
    }
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }
}
