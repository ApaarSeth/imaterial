import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { DashBoardResolver } from "./features/dashboard/resolver/dashboard.resolver";
import { BomResolver } from "./features/bom/bom.resolver";
import { RFQResolver } from "./features/rfq/resolver/rfq.resolver";

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
  },
  {
    path: "rfq",
    loadChildren: () =>
      import("./features/rfq/rfq.module").then(m => m.RFQModule)
  },
  {
    path: "po",
    loadChildren: () => import("./features/po/po.module").then(m => m.POModule)
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/auth.module").then(m => m.AuthModule)
  },
  {
    path: "rfq-indent-detail",
    loadChildren: () =>
      import(
        "./features/rfq-indent-template/rfq-indent-detail-template.module"
      ).then(m => m.RFQIndentDetailTemplateModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
