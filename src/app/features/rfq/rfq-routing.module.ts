import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RFQResolver } from "./resolver/rfq.resolver";
import { RFQProjectMaterialsComponent } from "./project-materials/project-materials.component";
import { RFQQuantityMakesComponent } from "./quantity-makes/quantity-makes.component";

const routes: Routes = [
  {
    path: "project-materials",
    resolve: { rfq: RFQResolver },
    component: RFQProjectMaterialsComponent
  },
  {
    path: "quantity-makes",
    component: RFQQuantityMakesComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RFQRoutingModule {}
