import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material-modules";
import { ProjectItemComponent } from "./project-item/project-item.component";
import { ChipComponent } from "./chip/chip.component";
import { UploadComponent } from "./upload/upload.component";
import { GlobalLoaderComponent } from './global-loader/global-loader.component';

const components = [ProjectItemComponent, ChipComponent, UploadComponent,  GlobalLoaderComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule
  ],

  declarations: components,
  entryComponents: [],
  exports: components
})
export class SharedComponentsModule {}
