import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { ProjectItemComponent } from "src/app/shared/components/project-item/project-item.component";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule
  ],
  providers: [],
  declarations: [DashboardComponent, AppSharedModule, ProjectItemComponent]
})
export class DashboardModule {}
