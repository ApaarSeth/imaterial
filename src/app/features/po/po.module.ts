import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { PODetailComponent } from "./po-detail-list/po-detail-list.component";
import { PORoutingModule } from "./po-routing.module";
import { PODetailListResolver } from "./resolver/po-detail-list-resolver";
import { PoTableComponent } from "./po-table/po-table.component";
import { PoComponent } from "./po.component";
import { PoCardComponent } from "./po-card/po-card.component";
import { PoDocumentsComponent } from "./po-documents/po-documents.component";
import { PoSupplierComponent } from "./po-supplier/po-supplier.component";
import { PoSuppliersResolver } from "./po-supplier/resolver/po.resolver";

@NgModule({
  declarations: [
    PoComponent,
    PODetailComponent,
    PoTableComponent,
    PoCardComponent,
    PoDocumentsComponent,
    PoSupplierComponent
  ],
  imports: [
    CommonModule,
    PORoutingModule,
    MaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    AppSharedModule
  ],
  providers: [PODetailListResolver, PoSuppliersResolver]
})
export class POModule {}
