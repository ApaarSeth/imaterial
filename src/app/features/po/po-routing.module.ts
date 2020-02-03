import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { PODetailListResolver } from "./resolver/po-detail-list-resolver";
import { PoComponent } from "./po.component";
import { PODetailComponent } from "./po-detail-list/po-detail-list.component";
import { PoSupplierComponent } from "./po-supplier/po-supplier.component";
import { PoSuppliersResolver } from "./po-supplier/resolver/po.resolver";

const routes: Routes = [
  {
    path: "detail-list",
    resolve: { poDetailList: PODetailListResolver },
    component: PODetailComponent
  },
  {
    path: "po-generate/:id",
    component: PoComponent
  },
  {
    path: "po-supplier",
    resolve: { supplier: PoSuppliersResolver },
    component: PoSupplierComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class PORoutingModule {}
