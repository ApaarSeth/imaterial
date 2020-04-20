import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { SharedComponentsModule } from 'src/app/shared/components/shared-component.modules';
import { UnapprovedMaterialTabComponent } from './unapproved-materials-tab/unapprovedMaterialTab.component';
import { MyMaterialTabComponent } from './my-materials-tab/myMaterialTab.component';
import { MyMaterialComponent } from './my-material.component';
import { MyMaterialRoutingModule } from './my-material.routing';
@NgModule({
    declarations: [MyMaterialTabComponent, UnapprovedMaterialTabComponent, MyMaterialComponent],
    imports: [
        CommonModule,
        MyMaterialRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        LayoutModule,
        SharedComponentsModule,
        AppSharedModule
    ]
})
export class MyMaterialModule { }
