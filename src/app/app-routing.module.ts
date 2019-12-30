import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { DashBoardResolver } from "./features/dashboard/resolver/dashboard.resolver";

const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    resolve: { dashBoardData: DashBoardResolver }
  },
  {
    path: "bom",
    loadChildren: () =>
      import("./features/bom/bom.module").then(m => m.BomModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
