import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";
import { ActivatedRoute } from "@angular/router";
import { MatStepper } from "@angular/material";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-create-rfq",
  templateUrl: "./create-rfq.component.html"
})
export class CreateRfqComponent implements OnInit {
  @ViewChild("stepper", { static: true, read: MatStepper })
  stepper: MatStepper;
  updatedRfqMaterial: RfqMaterialResponse[];
  rfqMaterial: RfqMaterialResponse[];
  stpForm: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("params", params);
      if (this.stepper) {
        this.stepper.selectedIndex = params.selectedIndex - 1;
      }
    });

    this.stpForm = this.formBuilder.group({
      mat: [],
      qty: []
    });
  }

  getQuantityAndMakes(updatedMaterials: RfqMaterialResponse[]) {
    this.updatedRfqMaterial = updatedMaterials;
  }
  getMaterial(materials: RfqMaterialResponse[]) {
    console.log("materials", materials);
    this.rfqMaterial = materials;

    console.log("materials", this.stpForm.value);
  }
  selectionChange(event) {
    if (event.previouslySelectedIndex === 0) {
      console.group("selected mat", this.stpForm.get("mat").value);
      this.rfqMaterial = this.stpForm.get("mat").value;
    }
    console.log(event);
    console.log("materials", this.rfqMaterial);
    console.log("updatedRfqMaterial", this.updatedRfqMaterial);
    console.log(event);
  }
}
