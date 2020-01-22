import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { PODetailComponent } from "./po-detail-list/po-detail-list.component";

const routes: Routes = [
  {
    path: "",
    component: PODetailComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class PODetailsRoutingModule {}
