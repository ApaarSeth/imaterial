import { BomEditMaterialComponent } from './bom/bom-edit-material/bom-edit-materials.component';
import { EditBomMaterialResolver } from './bom/edit-material.resolver';
import { Routes, RouterModule } from '@angular/router'; import { IndentDashboardComponent } from '../indent/indent-dashboard.component'; import { IndentResolver } from '../indent/resolver/indent.resolver'; import { IndentDetailComponent } from '../indent/indent-detail/indent-detail.component'; import { SingleIndentDetailsComponent } from '../indent/single-indent-details/single-indent-details.component'; import { NgModule } from '@angular/core'; import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { BomComponent } from './bom/bom.component';
import { BomTableComponent } from './bom/bom-table/bom-table.component';
import { CountryResolver } from 'src/app/shared/resolver/country.resolver';
import { BomCopyMaterialComponent } from './bom/bom-copy-materials/bom-copy-materials.component';

const routes: Routes = [
    {
        path: "", component: DashboardComponent,
        resolve: {
            countryList: CountryResolver
        }
    },
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
    },
    {
        path: "bom/:id/copy-materials",
        component: BomCopyMaterialComponent,
        data: {
            breadcrumb: 'BOM-Copy-Materials'
        }
    },
    {
        path: "bom/:id/edit-materials",
        component: BomEditMaterialComponent,
        data: {
            breadcrumb: 'BOM-Edit-Materials'
        },
        resolve: {
            editMaterialsData: EditBomMaterialResolver
        }
    }
];

@NgModule({
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    providers: [ CountryResolver, EditBomMaterialResolver ]
})
export class DashboardRoutingModule { }
