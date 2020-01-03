import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BomRoutingModule } from "./bom-routing.module";
import { BomComponent } from "./bom.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { AppSharedModule } from 'src/app/shared/app-shared-module';
import { BomPreviewComponent } from "./bom-preview/bom-preview.component";
import { ProjectItemComponent } from 'src/app/shared/components/project-item/project-item.component';

@NgModule({
  declarations: [BomComponent, BomPreviewComponent,ProjectItemComponent],
  imports: [
    CommonModule,
    BomRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LayoutModule,
    AppSharedModule
  ]
})
export class BomModule {}
