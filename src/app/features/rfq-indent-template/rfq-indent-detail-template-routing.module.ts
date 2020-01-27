import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { RFQIndentDetailComponent } from "./rfq-indent-detail/rfq-indent-detail.component";
const routes: Routes = [
  {
    path: "template",
    component: RFQIndentDetailComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class RFQIndentDetailRoutingModule {}
