import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/shared/material-modules';
import { LayoutModule } from 'src/app/shared/layout/layout-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from 'src/app/shared/app-shared-module';


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
        AppSharedModule
    ]
  })
  export class DashboardModule { } 