import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { PODetailListResolver } from "./resolver/po-detail-list-resolver";
import { PoComponent } from "./po.component";
import { PODetailComponent } from "./po-detail-list/po-detail-list.component";
import { PoSupplierComponent } from "./initiate-po/po-supplier/po-supplier.component";
import { InitiatePoResolver } from "./initiate-po/resolver/po.resolver";
import { ViewGRNComponent } from "./view-grn/view-grn.component";
import { AddGRNComponent } from "./add-grn/add-grn.component";
import { InitiatePoComponent } from "./initiate-po/initiate-po.component";
import { ViewGrnResolver } from "./add-grn/resolver/get-grn.resolver";

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
    path: "initiate-po",
    resolve: { inititatePo: InitiatePoResolver },
    component: InitiatePoComponent
  },
  {
    path: "add-grn/:poId",
    resolve: { viewGRN: ViewGrnResolver },
    component: AddGRNComponent
  },
  {
    path: "view-grn/:poId",
    component: ViewGRNComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class PORoutingModule {}
