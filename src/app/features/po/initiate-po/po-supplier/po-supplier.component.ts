import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-po-supplier",
  templateUrl: "./po-supplier.component.html"
})
export class PoSupplierComponent implements OnInit {
  @Output() selectedSupplier = new EventEmitter<any>();
  buttonName: string = "selectSupplier";
  searchText: string = null;
  allSuppliers: Suppliers[];
  form: FormGroup;
  displayedColumns: string[] = [
    "Supplier Name",
    "Email",
    "Phone No.",
    "PAN No."
  ];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.allSuppliers = this.activatedRoute.snapshot.data.inititatePo[0].data;
    this.formInit();
  }

  selectProject() {}

  formInit() {
    this.form = this.formBuilder.group({
      supplier: []
    });
  }

  setButtonName(name: string) {
    this.buttonName = name;
  }

  choosenSupplier() {
    return this.selectedSupplier.emit(this.form.value.supplier);
  }
}
