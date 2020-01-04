import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BomComponent } from "./bom.component";
import { Routes, RouterModule } from "@angular/router";
import { BomTableComponent } from "./bom-table/bom-table.component";

const routes: Routes = [
  { path: "", component: BomComponent },
  { path: "bom-detail", component: BomTableComponent }
];

@NgModule({
  declarations: [BomComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class BomRoutingModule {}
