import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { RFQProjectMaterialsComponent } from "./project-materials/project-materials.component";
import { RFQResolver } from "./resolver/rfq.resolver";
import { RFQRoutingModule } from "./rfq-routing.module";
import { RFQQuantityMakesComponent } from "./quantity-makes/quantity-makes.component";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    AppSharedModule,
    RFQRoutingModule
  ],
  providers: [RFQResolver],
  declarations: [RFQProjectMaterialsComponent, RFQQuantityMakesComponent]
})
export class RFQModule {}
