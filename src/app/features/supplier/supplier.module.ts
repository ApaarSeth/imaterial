import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { SupplierDetailComponent } from './supplier-details/supplier-details.component';
import { SupplierRoutingModule } from './supplier-routing.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SearchPipe } from 'src/app/shared/pipes/searchPipe';

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
    SupplierRoutingModule
  ],
  declarations: [SupplierDetailComponent],
  providers:[SearchPipe]
})
export class SupplierDashboardModule {}
