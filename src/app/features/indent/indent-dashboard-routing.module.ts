import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { IndentDashboardComponent } from "./indent-dashboard.component";
import { IndentDetailComponent } from "./indent-detail/indent-detail.component";

const routes: Routes = [
  { path: "", component: IndentDashboardComponent },
  { path: "indent-detail", component: IndentDetailComponent }
];

@NgModule({
  declarations: [IndentDashboardComponent],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class IndentRoutingModule {}
