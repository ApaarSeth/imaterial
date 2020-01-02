import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DataService } from "./services/data.service";
import { SharedComponentsModule } from "./components/shared-component.modules";
import { SharedDialogs } from "./dialogs/shared-dialog";
import { MaterialModule } from "./material-modules";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchPipe } from './pipes/searchPipe';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DataService],
  declarations: [...SharedDialogs,SearchPipe],
  exports: [...SharedDialogs,SearchPipe],
  entryComponents: [...SharedDialogs]
})
export class AppSharedModule {}
