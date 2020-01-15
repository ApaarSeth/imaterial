import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { GlobalStoreComponent } from "./global-store.component";
import { GlobalStoreResolver } from "./Resolver/global-store.resolver";

const routes: Routes = [
  {
    path: "",
    component: GlobalStoreComponent,
    resolve: { globalData: GlobalStoreResolver }
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class GlobalRoutingModule {}
