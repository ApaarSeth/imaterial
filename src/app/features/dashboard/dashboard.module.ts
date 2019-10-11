import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/shared/material-modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        MaterialModule,
        NgbModule
    ] ,
    providers:[],
    declarations: [ 
        DashboardComponent,
    ]
  })
  export class DashboardModule { }