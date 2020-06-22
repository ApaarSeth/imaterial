import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { UpdateInfoComponent } from './update-info/update-info.component';
import { AddUserComponent } from './add-user/add-user.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { EmailVerificationComponent } from './email-verification/email-verificatiion.component';

const routes: Routes = [
    {
        path: 'update-info',
        component: UpdateInfoComponent
    },

    {
        path: 'add-user',
        component: AddUserComponent
    },

    {
        path: 'terms-conditions',
        component: TermsConditionsComponent
    },

    {
        path: 'email-verification',
        component: EmailVerificationComponent
    }


];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)]
})

export class FirstLoginRoutingModule { }