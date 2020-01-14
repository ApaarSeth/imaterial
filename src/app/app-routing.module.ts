import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { DashBoardResolver } from "./features/dashboard/resolver/dashboard.resolver";
import { BomResolver } from "./features/bom/bom.resolver";
import { GlobalStoreResolver } from "./features/global-store/Resolver/global-store.resolver";

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
      import("./features/indent/indent-dashboard.module").then(
        m => m.IndentDashboardModule
      )
  },
  {
    path: "globalStore/:id",
    loadChildren: () =>
      import("./features/global-store/global-store.module").then(
        m => m.GlobalStoreModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
