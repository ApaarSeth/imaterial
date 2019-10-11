import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const appRoutes: Routes = [

    { path: 'dashboard', component: DashboardComponent },
    //{ path: 'dashboard', loadChildren: 'app/features/dashboard/dashboard.module#DashboardModule', canActivate: [] },
    { path: '', component: DashboardComponent },
    //{ path: '**', component: canActivate: [AuthManager] },
   ];
//    export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

   @NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
 
