import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RFQSupplierDetailComponent } from "./rfq-supplier-detail/rfq-supplier-detail.component";
import { RFQSupplierAfterBidComponent } from './rfq-supplier-after-bid/rfq-supplier-after-bid.component';
const routes: Routes = [
  {
    path: "supplier/:rfqId/:supplierId",
    component: RFQSupplierDetailComponent,
  },
    {
    path: "after-submit/:brandList/:MaterialList",
    component: RFQSupplierAfterBidComponent,
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RFQSupplierDetailRoutingModule {}
