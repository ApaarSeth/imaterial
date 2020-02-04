import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { SupplierDetailComponent } from './supplier-details/supplier-details.component';
const routes: Routes = [
  {
    path: "detail",
    component: SupplierDetailComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class SupplierRoutingModule {}
