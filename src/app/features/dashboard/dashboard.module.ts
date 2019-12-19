import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/shared/material-modules';
import { LayoutModule } from 'src/app/shared/layout/layout-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogOverviewExampleDialog } from 'src/app/shared/models/add-project/dialog-overview-example-dialog.component';


@NgModule({
    imports: [
        MaterialModule,
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ] ,
    providers:[],
    declarations: [ 
        DashboardComponent,
        DialogOverviewExampleDialog
    ]
  })
  export class DashboardModule { } 