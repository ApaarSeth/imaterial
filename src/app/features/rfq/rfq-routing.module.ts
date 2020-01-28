import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RFQResolver } from "./resolver/rfq.resolver";
import { RFQProjectMaterialsComponent } from "./project-materials/project-materials.component";
import { RFQQuantityMakesComponent } from "./quantity-makes/quantity-makes.component";
import { RefDetailComponent } from "./ref-detail/ref-detail.component";
import { RfqBidsComponent } from "./rfq-bids/rfq-bids.component";
import { SuppliersComponent } from "./suppliers/suppliers.component";
import { DocumentsComponent } from "./documents/documents.component";
import { ReviewComponent } from "./review/review.component";
import { RFQSuppliersResolver } from "./suppliers/supplier-resolver";
import { QuantityMakesResolver } from "./quantity-makes/quantity-makes-resolver";

const routes: Routes = [
  {
    path: "project-materials",
    resolve: { rfq: RFQResolver },
    component: RFQProjectMaterialsComponent
  },
  {
    path: "quantity-makes",
    //resolve: { quantityMakes: QuantityMakesResolver },
    component: RFQQuantityMakesComponent
  },
  {
    path: "rfq-detail",
    component: RefDetailComponent
  },
  {
    path: "rfq-bid/:id",
    component: RfqBidsComponent
  },
  {
    path: "suppliers",
    resolve: { supplier: RFQSuppliersResolver },
    component: SuppliersComponent
  },
  {
    path: "documents",
    component: DocumentsComponent
  },
  {
    path: "review",
    component: ReviewComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RFQRoutingModule {}
