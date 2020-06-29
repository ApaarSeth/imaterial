import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { VerifyEmailComponent } from './verify-email.component';
const routes: Routes = [
    {
        path: ":token",
        component: VerifyEmailComponent,
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)]
})
export class VerifyEmailRoutingModule { }
