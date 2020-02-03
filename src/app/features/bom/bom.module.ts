import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BomRoutingModule } from "./bom-routing.module";
import { BomComponent } from "./bom.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { BomPreviewComponent } from "./bom-preview/bom-preview.component";
import { BomTableComponent } from "./bom-table/bom-table.component";
import { BomResolver } from "./bom.resolver";
import { IssueToIndentResolver } from 'src/app/shared/dialogs/issue-to-indent/issue-to-indent-resolver';

@NgModule({
  declarations: [BomComponent, BomPreviewComponent, BomTableComponent],
  imports: [
    CommonModule,
    BomRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LayoutModule,
    AppSharedModule
  ],
  providers: [BomResolver, IssueToIndentResolver]
})
export class BomModule { }
