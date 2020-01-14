import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RFQResolver } from "./resolver/rfq.resolver";
import { RFQProjectMaterialsComponent } from "./project-materials/project-materials.component";
import { SuppliersComponent } from './suppliers/suppliers.component';

const routes: Routes = [
  {
    path: "project-materials",
    resolve: { rfq: RFQResolver },
    component: RFQProjectMaterialsComponent
  },
  {
    path: "suppliers",
    component: SuppliersComponent
  }
];

@NgModule({
  declarations: [RFQProjectMaterialsComponent, SuppliersComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RFQRoutingModule { }
