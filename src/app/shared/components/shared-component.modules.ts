import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material-modules';
import { CardLayoutComponent } from './card-layout/card-layout-component';


const components = [
    CardLayoutComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule
    // HeaderSharedModule
  ],

  declarations: components,
  entryComponents: [
  ],
  exports: components,

})
export class SharedComponentsModule { }