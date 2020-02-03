import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { PODetailListResolver } from "./resolver/po-detail-list-resolver";
import { PoComponent } from "./po.component";
import { PODetailComponent } from "./po-detail-list/po-detail-list.component";
import { ViewGRNComponent } from './view-grn/view-grn.component';
import { AddGRNComponent } from './add-grn/add-grn.component';

const routes: Routes = [
  {
    path: "detail-list",
    resolve: { poDetailList: PODetailListResolver },
    component: PODetailComponent
  },
  {
    path: "po-generate/:id",
    component: PoComponent
  },
  {
    path: "add-grn",
    component: AddGRNComponent
  },
  {
    path: "view-grn",
    component: ViewGRNComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class PORoutingModule { }
