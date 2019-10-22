import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/shared/material-modules';
import { LayoutModule } from 'src/app/shared/layout/layout-module';

@NgModule({
    imports: [
        MaterialModule,
        LayoutModule
    ] ,
    providers:[],
    declarations: [ 
        DashboardComponent,
    ]
  })
  export class DashboardModule { } 