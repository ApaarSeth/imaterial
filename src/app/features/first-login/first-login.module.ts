import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { LayoutModule } from "src/app/shared/layout/layout-module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "src/app/shared/app-shared-module";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { UpdateInfoComponent } from './update-info/update-info.component';
import { FirstLoginRoutingModule } from './first-login.routing';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
    imports: [
        CommonModule,
        FirstLoginRoutingModule,
        MaterialModule,
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        RouterModule,
        AppSharedModule,
    ],
    declarations: [
        UpdateInfoComponent,
         AddUserComponent
    ]
})

export class FirstLoginModule { }