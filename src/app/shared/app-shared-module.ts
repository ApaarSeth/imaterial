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
import { PickDateAdapter, PICK_FORMATS } from './services/date.service';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { OnlyNumberDirective } from './directives/number-only2.directive';
import { TwoDigitDecimaNumberDirective } from './directives/appTwoDigit';

@NgModule({
  imports: [CommonModule, RouterModule, SharedComponentsModule, MaterialModule, FormsModule, ReactiveFormsModule],
  providers: [DataService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ],
  declarations: [...SharedDialogs, SearchPipe, SearchMaterialPipe, NumberToWordsPipe, OnlyNumberDirective, TwoDigitDecimaNumberDirective],
  exports: [...SharedDialogs, SearchPipe, SearchMaterialPipe, SharedComponentsModule, NumberToWordsPipe, OnlyNumberDirective, TwoDigitDecimaNumberDirective],
  entryComponents: [...SharedDialogs]
})

export class AppSharedModule { }