import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { DashBoardResolver } from "./features/dashboard/resolver/dashboard.resolver";
import { BomResolver } from './features/bom/bom.resolver';

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    resolve: { dashBoardData: DashBoardResolver }
  },
  {
    path: "bom/:id",
    resolve: { bomCategory: BomResolver },
    loadChildren: () =>
      import("./features/bom/bom.module").then(m => m.BomModule)
  }, 
  {
    path: "indent/:id",
    loadChildren: () =>
      import("./features/indent/indent-dashboard.module").then(m => m.IndentDashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
