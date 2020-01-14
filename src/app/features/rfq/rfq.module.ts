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
import { SuppliersDialogComponent } from "./suppliers/suppliers-dialog.component";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDialogModule } from "@angular/material/dialog";

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
    MatIconModule,
    MatCheckboxModule,
    MatGridListModule,
    MatDialogModule
  ],
  providers: [RFQResolver],
  declarations: [
    RFQProjectMaterialsComponent,
    SuppliersComponent,
    SuppliersDialogComponent
  ],
  entryComponents: [SuppliersDialogComponent]
})
export class RFQModule {}
