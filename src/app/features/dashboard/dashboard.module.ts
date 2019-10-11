import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/shared/material-modules';

@NgModule({
    imports: [
        MaterialModule
    ] ,
    providers:[],
    declarations: [ 
        DashboardComponent,
    ]
  })
  export class DashboardModule { }