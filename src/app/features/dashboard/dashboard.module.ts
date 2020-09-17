import { BomCommonTableComponent } from './bom/bom-common-table/bom-common-table.component';
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { DashboardRoutingModule } from './dashboard-routing.module';
import { BomComponent } from './bom/bom.component';
import { BomTopMaterialComponent } from './bom/bom-topMaterial/bom-topMaterial.component';
import { BOMAllMaterialComponent } from './bom/bom-allMaterial/bom-allMaterial.component';
import { BomTableComponent } from './bom/bom-table/bom-table.component';
import { BomMyMaterialComponent } from './bom/bom-myMaterial/bom-myMaterial.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-component.modules';
import { BomCopyMaterialComponent } from './bom/bom-copy-materials/bom-copy-materials.component';
import { BomEditMaterialComponent } from './bom/bom-edit-material/bom-edit-materials.component';

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
    DashboardRoutingModule,
    SharedComponentsModule
  ],
  providers: [],
  declarations: [ DashboardComponent, BomComponent,
    BomTopMaterialComponent,
    BOMAllMaterialComponent,
    BomTableComponent,
    BomMyMaterialComponent,
    BomCopyMaterialComponent,
    BomEditMaterialComponent,
    BomCommonTableComponent
  ]
})
export class DashboardModule { }
