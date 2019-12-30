import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DataService } from "./services/data.service";
import { SharedComponentsModule } from "./components/shared-component.modules";
import { SharedDialogs } from "./dialogs/shared-dialog";
import { MaterialModule } from "./material-modules";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DataService],
  declarations: [...SharedDialogs],
  exports: [...SharedDialogs],
  entryComponents: [...SharedDialogs]
})
export class AppSharedModule {}
