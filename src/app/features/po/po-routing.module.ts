import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { PODetailComponent } from "./po-detail-list/po-detail-list.component";
import { PODetailListResolver } from "./resolver/po-detail-list-resolver";

const routes: Routes = [
  {
    path: "detail-list",
    resolve: { poDetailList: PODetailListResolver },
    component: PODetailComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class PORoutingModule {}
