import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RFQResolver } from "./resolver/rfq.resolver";
import { RFQProjectMaterialsComponent } from "./project-materials/project-materials.component";
import { RefDetailComponent } from "./ref-detail/ref-detail.component";
import { RfqBidsComponent } from "./rfq-bids/rfq-bids.component";
import { SuppliersComponent } from "./suppliers/suppliers.component";
import { DocumentsComponent } from "./documents/documents.component";
import { ReviewComponent } from "./review/review.component";

const routes: Routes = [
  {
    path: "project-materials",
    resolve: { rfq: RFQResolver },
    component: RFQProjectMaterialsComponent
  },
  {
    path: "rfq-detail",
    component: RefDetailComponent
  },
  {
    path: "rfq-bid",
    component: RfqBidsComponent
  },
  {
    path: "suppliers",
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
