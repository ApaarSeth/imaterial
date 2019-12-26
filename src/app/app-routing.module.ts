import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DashBoardResolver } from './features/dashboard/resolver/dashboard.resolver';


const routes: Routes = [
    { path: '', 
     component: DashboardComponent,
    resolve:{ dashBoardData: DashBoardResolver} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
