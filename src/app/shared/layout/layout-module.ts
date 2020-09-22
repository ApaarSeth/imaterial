import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material-modules";

@NgModule({
  imports: [MaterialModule, FlexLayoutModule, CommonModule],
  providers: [],
  exports: [], // [HeaderLayoutComponent, SidenavListComponent],
  declarations: [] // [HeaderLayoutComponent, SidenavListComponent]
})
export class LayoutModule { }
