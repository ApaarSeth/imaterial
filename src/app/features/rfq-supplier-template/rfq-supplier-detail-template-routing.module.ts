import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RFQSupplierDetailComponent } from "./rfq-supplier-detail/rfq-supplier-detail.component";
import { RFQSupplierDetailResolver } from "./rfq-supplier-detail/rfq-supplier-detail.resolver";
const routes: Routes = [
  {
    path: "template",
    resolve: { rfqSupplierDetailResolver: RFQSupplierDetailResolver },
    component: RFQSupplierDetailComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RFQSupplierDetailRoutingModule {}
