import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RFQSupplierDetailComponent } from "./rfq-supplier-detail/rfq-supplier-detail.component";
import { RFQSupplierAfterBidComponent } from './rfq-supplier-after-bid/rfq-supplier-after-bid.component';
import { RFQSupplierAddAddressComponent } from './rfq-supplier-add-address/rfq-supplier-add-address.component';
const routes: Routes = [
  {
    path: "supplier/:rfqId/:supplierId",
    component: RFQSupplierDetailComponent,
  },
    {
    path: "finish/:brandList/:MaterialList",
    component: RFQSupplierAfterBidComponent,
  },
  {
    path: "finish",
    component: RFQSupplierAfterBidComponent,
  },
  {
    path: "add-address/:brandList/:MaterialList",
    component:  RFQSupplierAddAddressComponent,
  }

];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RFQSupplierDetailRoutingModule {}
