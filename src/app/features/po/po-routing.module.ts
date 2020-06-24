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
import { CountryResolver } from 'src/app/shared/resolver/country.resolver';

const routes: Routes = [
  {
    path: "",
    resolve: { poDetailList: PODetailListResolver },
    component: PODetailComponent
  },
  {
    path: "po-generate/:id/:mode",
    data: { breadcrumb: 'PO' },
    component: PoComponent
  },
  {
    path: "initiate-po",
    data: { breadcrumb: 'Create PO' },
    resolve: { inititatePo: InitiatePoResolver, countryList: CountryResolver },
    component: InitiatePoComponent
  },
  {
    path: "add-grn/:poId",
    data: { breadcrumb: 'ADD GRN' },
    resolve: { viewGRN: ViewGrnResolver },
    component: AddGRNComponent
  },
  {
    path: "view-grn/:poId",
    data: { breadcrumb: 'View GRN' },
    component: ViewGRNComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class PORoutingModule { }
