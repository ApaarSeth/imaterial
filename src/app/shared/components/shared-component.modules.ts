import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material-modules';
import { ProjectItemComponent } from './project-item/project-item.component';

const components = [
    ProjectItemComponent,
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