import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { RFQSupplierDetailRoutingModule } from "./rfq-supplier-detail-template-routing.module";
import { RFQSupplierDetailComponent } from "./rfq-supplier-detail/rfq-supplier-detail.component";
import { RFQSupplierDetailResolver } from "./rfq-supplier-detail/rfq-supplier-detail.resolver";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    RFQSupplierDetailRoutingModule
  ],
  providers: [RFQSupplierDetailResolver],
  declarations: [RFQSupplierDetailComponent]
})
export class RFQSupplierDetailTemplateModule {}
