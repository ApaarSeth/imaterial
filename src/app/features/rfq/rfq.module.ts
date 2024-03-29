import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { RFQResolver } from "./resolver/rfq.resolver";
import { RFQRoutingModule } from "./rfq-routing.module";
import { RfqBidsComponent } from "./rfq-bids/rfq-bids.component";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDialogModule } from "@angular/material/dialog";
import { ReviewComponent } from "./review/review.component";
import { RFQViewComponent } from "./rfq-view/rfq-view.component";
import { CreateRfqComponent } from "./create-rfq/create-rfq.component";
import { RfqQuantityMakesComponent } from "./create-rfq/rfq-quantity-makes/rfq-quantity-makes.component";
import { RfqProjectMaterialsComponent } from "./create-rfq/rfq-project-materials/rfq-project-materials.component";
import { RfqSupplierComponent } from "./create-rfq/rfq-supplier/rfq-supplier.component";
import { CreateRfqResolver } from "./create-rfq/resolver/createRfq.resolver";
import { SharedComponentsModule } from 'src/app/shared/components/shared-component.modules';
import { RfqDetailComponent } from "./rfq-detail/rfq-detail.component";

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
    MatDialogModule,
    SharedComponentsModule
  ],
  providers: [RFQResolver, CreateRfqResolver],
  declarations: [
    RfqQuantityMakesComponent,
    RfqProjectMaterialsComponent,
    RfqSupplierComponent,
    RfqDetailComponent,
    RfqBidsComponent,
    ReviewComponent,
    RFQViewComponent,
    CreateRfqComponent
  ]
})
export class RFQModule { }
