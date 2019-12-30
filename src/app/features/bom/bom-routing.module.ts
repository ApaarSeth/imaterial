import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BomComponent } from "./bom.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [{ path: "", component: BomComponent }];

@NgModule({
  declarations: [BomComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class BomRoutingModule {}
