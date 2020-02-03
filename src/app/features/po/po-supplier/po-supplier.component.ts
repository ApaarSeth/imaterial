import { Component, OnInit } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-po-supplier",
  templateUrl: "./po-supplier.component.html",
  styleUrls: ["./po-supplier.component.scss"]
})
export class PoSupplierComponent implements OnInit {
  buttonName: string = "selectSupplier";
  searchText: string = null;
  allSuppliers: Suppliers[];
  form: FormGroup;
  displayedColumns: string[] = [
    "Supplier Name",
    "Email",
    "Phone No.",
    "PAN No.",
    "customColumn"
  ];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.allSuppliers = this.activatedRoute.snapshot.data.supplier;
    this.formInit();
  }

  selectProject() {}

  formInit() {
    this.form = this.formBuilder.group({});
  }

  setButtonName(name: string) {
    this.buttonName = name;
  }

  onSubmit() {}
}
