import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BomRoutingModule } from "./bom-routing.module";
import { BomComponent } from "./bom.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { BomPreviewComponent } from "./bom-preview/bom-preview.component";

@NgModule({
  declarations: [BomComponent, BomPreviewComponent],
  imports: [
    CommonModule,
    BomRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LayoutModule
  ]
})
export class BomModule {}
