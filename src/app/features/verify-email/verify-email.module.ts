import { NgModule } from "@angular/core";
import { MaterialModule } from "src/app/shared/material-modules";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { AppSharedModule } from 'src/app/shared/app-shared-module';
import { VerifyEmailRoutingModule } from './verify-email.routing';
import { VerifyEmailComponent } from './verify-email.component';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        RouterModule,
        AppSharedModule,
        VerifyEmailRoutingModule,
    ],
    providers: [],
    declarations: [VerifyEmailComponent]
})
export class VerifyEmailModule { }
