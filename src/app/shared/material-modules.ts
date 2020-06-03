import { NgModule } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatRadioModule } from "@angular/material/radio";
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatExpansionModule,
  MatMenuModule,
  MatInputModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatChipsModule,
  MatTabsModule,
  MatStepperModule,
  MatSnackBarModule,
  MatSortModule,
  MatBadgeModule,
  MatSlideToggleModule,
  MatAutocompleteModule
} from "@angular/material";

@NgModule({
  exports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatExpansionModule,
    MatMenuModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatChipsModule,
    MatRadioModule,
    MatTabsModule,
    MatStepperModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSortModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatSlideToggleModule
  ]
})
export class MaterialModule { }
