import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BomComponent } from "./bom.component";
import { Routes, RouterModule } from "@angular/router";
import { BomTableComponent } from "./bom-table/bom-table.component";
import { IssueToIndentResolver } from 'src/app/shared/dialogs/issue-to-indent/issue-to-indent-resolver';

const routes: Routes = [
  { path: "", component: BomComponent },
  {
    path: "bom-detail",
    resolve: { IssueToIndent: IssueToIndentResolver },
    component: BomTableComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class BomRoutingModule { }
