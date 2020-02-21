import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { SuppliersDialogComponent } from "../../../shared/dialogs/add-supplier/suppliers-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
@Component({
  selector: "app-rfq-suppliers",
  templateUrl: "./suppliers.component.html"
})

export class SuppliersComponent implements OnInit {

  searchText: string = null;
  buttonName: string = "selectSupplier";

  displayedColumns: string[] = [
    "Supplier Name",
    "Email",
    "Phone No.",
    "PAN No.",
    "customColumn"
  ];

  allSuppliers: Suppliers[];
  selectedSuppliersList: Suppliers[];
  selectedSupplierFlag: boolean = false;
  checkedMaterialsList: RfqMaterialResponse[];
  orgId: number;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private router: Router
  ) { }

  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.allSuppliers = this.activatedRoute.snapshot.data.supplier;
    this.checkedMaterialsList = history.state.checkedMaterials;
    console.log("suppliers", this.allSuppliers);
    console.log("checkedMaterialsList", this.checkedMaterialsList);
  }

  setButtonName(name: string) {
    this.buttonName = name;
  }

  valueChange(supplier: Suppliers) {
    supplier.checked = !supplier.checked;
    let isOneEnabled = this.allSuppliers.find(x => x.checked);
    this.selectedSupplierFlag = false;
    if (isOneEnabled) {
      this.selectedSupplierFlag = true;
    }
    this.selectedSuppliersList = this.allSuppliers.filter(x => x.checked);
  }

  nevigateToUploadPage() {
    let checkedMaterialsList = this.checkedMaterialsList;
    let selectedSuppliersList = this.selectedSuppliersList;
    this.router.navigate(["/rfq/documents"], {
      state: { checkedMaterialsList, selectedSuppliersList }
    });
  }

  openDialog(projectId) {
    debugger
    const dialogRef = this.dialog.open(SuppliersDialogComponent, {
      width: "1200px",
      data: projectId
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => {
        this.rfqService.getSuppliers(this.orgId).then(data => {
          this.allSuppliers = data.data;
        });
      });
  }
}