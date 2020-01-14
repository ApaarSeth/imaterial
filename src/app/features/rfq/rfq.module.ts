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
import { SuppliersComponent } from "./suppliers/suppliers.component";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";

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
    RFQRoutingModule,
    MatTableModule,
    MatIconModule
  ],
  providers: [RFQResolver],
  declarations: [
    RFQProjectMaterialsComponent,
    AppSharedModule,
    SuppliersComponent
  ]
})
export class RFQModule {}
