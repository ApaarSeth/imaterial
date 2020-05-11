import { Routes, RouterModule } from '@angular/router'; import { IndentDashboardComponent } from '../indent/indent-dashboard.component'; import { IndentResolver } from '../indent/resolver/indent.resolver'; import { IndentDetailComponent } from '../indent/indent-detail/indent-detail.component'; import { SingleIndentDetailsComponent } from '../indent/single-indent-details/single-indent-details.component'; import { NgModule } from '@angular/core'; import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { BomComponent } from './bom/bom.component';
import { BomTableComponent } from './bom/bom-table/bom-table.component';

const routes: Routes = [
    { path: "", component: DashboardComponent },
    {
        path: "bom/:id", component: BomComponent,
        data: {
            breadcrumb: 'BOM'
        }
    },
    {
        path: "bom/:id/bom-detail",
        // resolve: { issueToIndent: IssueToIndentResolver },
        component: BomTableComponent,
        data: {
            breadcrumb: 'BOM-Detail'
        }
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)]
})
export class DashboardRoutingModule { }
