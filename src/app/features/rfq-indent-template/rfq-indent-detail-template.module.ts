import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { RFQIndentDetailRoutingModule } from "./rfq-indent-detail-template-routing.module";
import { RFQIndentDetailComponent } from "./rfq-indent-detail/rfq-indent-detail.component";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule,
    RFQIndentDetailRoutingModule
  ],
  providers: [],
  declarations: [RFQIndentDetailComponent]
})
export class RFQIndentDetailTemplateModule {}
