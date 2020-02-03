import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { IndentDashboardComponent } from "./indent-dashboard.component";
import { IndentDetailComponent } from "./indent-detail/indent-detail.component";
import { IndentResolver } from "./resolver/indent.resolver";
import { SingleIndentDetailsComponent } from './single-indent-details/single-indent-details.component';

const routes: Routes = [
  { path: "", component: IndentDashboardComponent },
  {
    path: "indent-detail",
    resolve: { indentList: IndentResolver },
    component: IndentDetailComponent
  },
  {
    path: "single-indent/:indentId",
    component: SingleIndentDetailsComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class IndentRoutingModule { }
