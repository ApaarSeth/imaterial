import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GlobalStoreComponent } from "./global-store.component";
import { ProjectWiseComponent } from "./project-wise/project-wise.component";
import { MaterialWiseComponent } from "./material-wise/material-wise.component";
import { GlobalRoutingModule } from "./global-store.routing";
import { GlobalStoreResolver } from "./Resolver/global-store.resolver";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "@angular/cdk/layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppSharedModule } from "src/app/shared/app-shared-module";

@NgModule({
  declarations: [
    GlobalStoreComponent,
    MaterialWiseComponent,
    ProjectWiseComponent
  ],
  imports: [
    CommonModule,
    GlobalRoutingModule,
    MaterialModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AppSharedModule
  ],
  providers: [GlobalStoreResolver]
})
export class GlobalStoreModule {}
