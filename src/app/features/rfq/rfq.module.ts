import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { RFQProjectMaterialsComponent } from "./project-materials/project-materials.component";
import { RFQResolver } from "./resolver/rfq.resolver";
import { RFQRoutingModule } from "./rfq-routing.module";
import { RefDetailComponent } from "./ref-detail/ref-detail.component";
import { RfqBidsComponent } from "./rfq-bids/rfq-bids.component";
import { SuppliersComponent } from "./suppliers/suppliers.component";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDialogModule } from "@angular/material/dialog";
import { DocumentsComponent } from "./documents/documents.component";
import { ReviewComponent } from "./review/review.component";
import { PurchaseOrderComponent } from "./purchase-order/purchase-order.component";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    AppSharedModule,
    RFQRoutingModule,
    MatTableModule,
    MatIconModule,
    MatCheckboxModule,
    MatGridListModule,
    MatDialogModule
  ],
  providers: [RFQResolver],
  declarations: [
    RFQProjectMaterialsComponent,
    RefDetailComponent,
    RfqBidsComponent,
    SuppliersComponent,
    DocumentsComponent,
    ReviewComponent,
    PurchaseOrderComponent
  ]
})
export class RFQModule {}
