import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataService } from "./services/data.service";
import { SharedComponentsModule } from "./components/shared-component.modules";
import { SharedDialogs } from "./dialogs/shared-dialog";
import { MaterialModule } from "./material-modules";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchPipe } from "./pipes/searchPipe";
import { NumberToWordsPipe } from "./pipes/number-to-words";
import { SearchMaterialPipe } from './pipes/searchMaterial';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, SharedComponentsModule, MaterialModule, FormsModule, ReactiveFormsModule],
  providers: [DataService],
  declarations: [...SharedDialogs, SearchPipe, SearchMaterialPipe, NumberToWordsPipe],
  exports: [...SharedDialogs, SearchPipe, SearchMaterialPipe, SharedComponentsModule, NumberToWordsPipe],
  entryComponents: [...SharedDialogs]
})

export class AppSharedModule { }