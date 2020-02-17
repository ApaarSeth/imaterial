import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";
import { ActivatedRoute } from "@angular/router";
import { MatStepper } from "@angular/material";

@Component({
  selector: "app-create-rfq",
  templateUrl: "./create-rfq.component.html"
})
export class CreateRfqComponent implements OnInit {
  @ViewChild("stepper", { static: true, read: MatStepper })
  stepper: MatStepper;
  updatedRfqMaterial: RfqMaterialResponse[];
  rfqMaterial: RfqMaterialResponse[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log("params", params);
      if (this.stepper) {
        this.stepper.selectedIndex = params.selectedIndex - 1;
      }
    });
  }

  getQuantityAndMakes(updatedMaterials: RfqMaterialResponse[]) {
    this.updatedRfqMaterial = updatedMaterials;
  }
  getMaterial(materials: RfqMaterialResponse[]) {
    this.rfqMaterial = materials;
  }
}
