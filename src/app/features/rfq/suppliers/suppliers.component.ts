import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { SuppliersDialogComponent } from "../../../shared/dialogs/add-supplier/suppliers-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { RfqMaterialResponse } from "src/app/shared/models/RFQ/rfq-details";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";

@Component({
  selector: "suppliers",
  templateUrl: "./suppliers.component.html",
  styleUrls: ["../../../../assets/scss/main.scss"]
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
  selectedSupplierFlag: boolean = false;
  checkedMaterialsList: RfqMaterialResponse[];

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private router: Router
  ) {}
  ngOnInit() {
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
  }
  nevigateToUploadPage() {
    let checkedMaterialsList = this.checkedMaterialsList;
    this.router.navigate(["/rfq/documents"], {
      state: { checkedMaterialsList }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SuppliersDialogComponent, {
      width: "1200px"
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => {
        // to do
        this.rfqService.getSuppliers(1).then(data => {
          console.log("wefrgthyjhgff", data.data);
          return data.data;
        });
      });
  }
}
