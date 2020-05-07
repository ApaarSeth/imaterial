import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "src/app/shared/material-modules";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [MaterialModule, FlexLayoutModule, CommonModule],
  providers: [],
  exports: [], // [HeaderLayoutComponent, SidenavListComponent],
  declarations: [] // [HeaderLayoutComponent, SidenavListComponent]
})
export class LayoutModule { }
