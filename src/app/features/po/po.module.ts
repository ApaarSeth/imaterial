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
import { PoSupplierComponent } from "./initiate-po/po-supplier/po-supplier.component";
import { InitiatePoResolver } from "./initiate-po/resolver/po.resolver";
import { ViewGRNComponent } from "./view-grn/view-grn.component";
import { AddGRNComponent } from "./add-grn/add-grn.component";
import { InitiatePoComponent } from "./initiate-po/initiate-po.component";
import { PoProjectMaterialComponent } from "./initiate-po/po-project-material/po-project-material.component";
import { PoQuantityMakesComponent } from "./initiate-po/po-quantity-makes/po-quantity-makes.component";
import { ViewGrnResolver } from "./add-grn/resolver/get-grn.resolver";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxEditorModule } from 'ngx-editor';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    PoComponent,
    PODetailComponent,
    PoTableComponent,
    PoCardComponent,
    PoDocumentsComponent,
    PoSupplierComponent,
    ViewGRNComponent,
    AddGRNComponent,
    InitiatePoComponent,
    PoProjectMaterialComponent,
    PoQuantityMakesComponent
  ],
  imports: [
    CommonModule,
    PORoutingModule,
    MaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    RouterModule,
    AppSharedModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
  ],
  providers: [PODetailListResolver, InitiatePoResolver, ViewGrnResolver]
})
export class POModule { }
