import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BomRoutingModule } from "./bom-routing.module";
import { BomComponent } from "./bom.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";

@NgModule({
  declarations: [BomComponent],
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
