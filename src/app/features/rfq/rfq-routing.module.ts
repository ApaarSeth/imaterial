import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RFQResolver } from "./resolver/rfq.resolver";
import { RFQProjectMaterialsComponent } from "./project-materials/project-materials.component";
import { RefDetailComponent } from "./ref-detail/ref-detail.component";
import { RfqBidsComponent } from "./rfq-bids/rfq-bids.component";

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
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RFQRoutingModule {}
