import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GlobalStoreComponent } from "./global-store.component";
import { ProjectWiseComponent } from "./project-wise/project-wise.component";
import { MaterialWiseComponent } from "./material-wise/material-wise.component";
import { GlobalRoutingModule } from "./global-store.routing";
import { GlobalStoreResolver } from "./Resolver/global-store.resolver";

@NgModule({
  declarations: [
    GlobalStoreComponent,
    MaterialWiseComponent,
    ProjectWiseComponent
  ],
  imports: [CommonModule, GlobalRoutingModule],
  providers: [GlobalStoreResolver]
})
export class GlobalStoreModule {}
