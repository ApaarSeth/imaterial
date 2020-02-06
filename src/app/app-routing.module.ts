import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { DashBoardResolver } from "./features/dashboard/resolver/dashboard.resolver";
import { BomResolver } from "./features/bom/bom.resolver";
import { RFQResolver } from "./features/rfq/resolver/rfq.resolver";
import { AuthLayoutComponent } from "./shared/layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./shared/layout/main-layout/main-layout.component";
import { NotFoundComponent } from "./features/not-found/not-found.component";
import { SupplierBidLayoutComponent } from "./shared/layout/supplier-bid-layout/supplier-bid-layout.component";

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  {
    path: "",
    component: SupplierBidLayoutComponent,
    children: [
      {
        path: "supplier",
        loadChildren: () =>
          import(
            "./features/rfq-supplier-template/rfq-supplier-detail-template.module"
          ).then(m => m.RFQSupplierDetailTemplateModule)
      }
    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "auth",
        loadChildren: () =>
          import("./features/auth/auth.module").then(m => m.AuthModule)
      },
      {
        path: "supplier",
        loadChildren: () =>
          import(
            "./features/rfq-supplier-template/rfq-supplier-detail-template.module"
          ).then(m => m.RFQSupplierDetailTemplateModule)
      }
    ]
  },
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {
        path: "dashboard",
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
        loadChildren: () =>
          import("./features/po/po.module").then(m => m.POModule)
      },
      {
        path: "users",
        loadChildren: () =>
          import("./features/users/user-dashboard.module").then(
            m => m.UserDashboardModule
          )
      },
      {
        path: "supplier",
        loadChildren: () =>
          import("./features/supplier/supplier.module").then(
            m => m.SupplierDashboardModule
          )
      }
    ]
  },
  {
    path: "404",
    component: NotFoundComponent
  },
  {
    path: "**",
    redirectTo: "404"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
