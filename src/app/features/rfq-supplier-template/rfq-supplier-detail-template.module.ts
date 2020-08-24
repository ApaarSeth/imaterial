import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { RFQSupplierDetailRoutingModule } from "./rfq-supplier-detail-template-routing.module";
import { RFQSupplierDetailComponent } from "./rfq-supplier-detail/rfq-supplier-detail.component";
import { RFQSupplierDetailResolver } from "./rfq-supplier-detail/rfq-supplier-detail.resolver";
import { RFQSupplierAfterBidComponent } from './rfq-supplier-after-bid/rfq-supplier-after-bid.component';
import { RFQSupplierAddAddressComponent } from './rfq-supplier-add-address/rfq-supplier-add-address.component';
import { RFQDocumentsComponent } from './rfq-bid-documents/rfq-bid-documents.component';
import { AppSharedModule } from 'src/app/shared/app-shared-module';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    AppSharedModule,
    RFQSupplierDetailRoutingModule,
    AngularEditorModule
  ],
  providers: [RFQSupplierDetailResolver],
  declarations: [RFQSupplierDetailComponent, RFQDocumentsComponent, RFQSupplierAfterBidComponent, RFQSupplierAddAddressComponent]
})
export class RFQSupplierDetailTemplateModule { }
