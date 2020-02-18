import { Component, OnInit, Input } from "@angular/core";
import { Suppliers } from "src/app/shared/models/RFQ/suppliers";
import { RfqMaterialResponse, AddRFQ } from "src/app/shared/models/RFQ/rfq-details";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { RFQService } from "src/app/shared/services/rfq/rfq.service";
import { SuppliersDialogComponent } from "src/app/shared/dialogs/add-supplier/suppliers-dialog.component";

@Component({
  selector: "app-rfq-supplier",
  templateUrl: "./rfq-supplier.component.html"
})
export class RfqSupplierComponent implements OnInit {
  @Input() selectedMaterialsList: AddRFQ;
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
  checkedMaterialsList: AddRFQ;
  orgId: number;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private rfqService: RFQService,
    private router: Router
  ) {}
  ngOnInit() {
    this.orgId = Number(localStorage.getItem("orgId"));
    this.allSuppliers = this.activatedRoute.snapshot.data.createRfq[0].data;
    console.log("suppliers", this.allSuppliers);
    console.log("checkedMaterialsList", this.checkedMaterialsList);
  }
  ngOnChanges(): void {
    this.checkedMaterialsList = this.selectedMaterialsList;
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
    // let checkedMaterialsList = this.checkedMaterialsList;
    this.checkedMaterialsList.supplierId=this.selectedSuppliersList.map(supplier=>supplier.supplierId);
    let finalRfqData=this.checkedMaterialsList
    let rfqId=this.selectedSuppliersList[1]
    this.router.navigate(["/rfq/review"], {
      state: { finalRfqData}
    });
    // this.router.navigate(["/rfq/documents"], {
    //   state: { checkedMaterialsList, selectedSuppliersList }
    // });
  }

  openDialog(projectId) {
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
