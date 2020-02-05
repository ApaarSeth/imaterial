import { Component, OnInit, ViewChildren } from "@angular/core";
import { PoSupplierComponent } from "./po-supplier/po-supplier.component";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";

@Component({
  selector: "app-initiate-po",
  templateUrl: "./initiate-po.component.html"
})
export class InitiatePoComponent implements OnInit {
  supplier: Suppliers;
  poDetail: RfqMaterialResponse;
  @ViewChildren("poSupplier") poSupplier: PoSupplierComponent;
  searchText = "";
  constructor() {}

  ngOnInit() {}

  nextStep() {}
  getSupplier(supplier: Suppliers) {
    console.log(supplier);
    this.supplier = supplier;
  }
  getMaterial(material: RfqMaterialResponse) {
    this.poDetail = material;
  }
}
