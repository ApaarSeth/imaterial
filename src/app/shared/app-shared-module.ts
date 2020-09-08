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
import { OnlyNumberDirective } from './directives/number-only2.directive';
import { TwoDigitDecimaNumberDirective } from './directives/appTwoDigit';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IndianNumberPipe } from './pipes/indianNumber';
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";

@NgModule({
  imports: [ CommonModule, RouterModule, SharedComponentsModule, MaterialModule, FormsModule, ReactiveFormsModule, AngularEditorModule, NgbModule ],
  providers: [ DataService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ],
  declarations: [ ...SharedDialogs, SearchMaterialPipe, NumberToWordsPipe, IndianNumberPipe, OnlyNumberDirective, TwoDigitDecimaNumberDirective ],
  exports: [ ...SharedDialogs, SearchMaterialPipe, SharedComponentsModule, NumberToWordsPipe, OnlyNumberDirective, TwoDigitDecimaNumberDirective, IndianNumberPipe, AngularEditorModule ]
})

export class AppSharedModule { }