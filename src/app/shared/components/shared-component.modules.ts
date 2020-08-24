import { AdvSearchItemComponent } from './adv-search-item/adv-search-item.component';
import { AdvanceInputNumberItemComponent } from './adv-input-number-item/adv-input-number-item.component';
import { AdvanceSelectItemComponent } from './adv-select-item/adv-select-item.component';
import { AdvanceDateItemComponent } from './adv-date-item/adv-date-item.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material-modules";
import { ProjectItemComponent } from "./project-item/project-item.component";
import { ChipComponent } from "./chip/chip.component";
import { UploadComponent } from "./upload/upload.component";
import { GlobalLoaderComponent } from './global-loader/global-loader.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RangeDatePicker } from './rangeDatePicker/datePicker.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ViewRatingComponent } from './view-rating/view-rating.component';
import { ViewImageComponent } from '../dialogs/view-image/view-image.component';
import { UploadImageComponent } from '../dialogs/upload-image/upload-image.component';
import { SupplierRatingComponent } from '../dialogs/supplier-rating/supplier-rating.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdvanceSearchComponent } from './advance-search/advance-search.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { NgModule } from '@angular/core';

const components = [ ProjectItemComponent, ChipComponent, UploadComponent, GlobalLoaderComponent, BreadcrumbComponent, RangeDatePicker, SubscriptionsComponent, ViewRatingComponent, UploadImageComponent, ViewImageComponent, SupplierRatingComponent, AdvanceSearchComponent, BarChartComponent, PieChartComponent, AdvanceDateItemComponent, AdvanceSelectItemComponent, AdvanceInputNumberItemComponent, AdvSearchItemComponent ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    NgbModule
  ],

  declarations: components,
  // entryComponents: [UploadImageComponent, ViewImageComponent, SupplierRatingComponent],
  exports: components
})
export class SharedComponentsModule { }
