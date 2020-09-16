import { TrialActiveResolver } from './trial-active/trial-active.resolver';
import { TrialActiveComponent } from './trial-active/trial-active.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { UpdateInfoComponent } from './update-info/update-info.component';
import { AddUserComponent } from './add-user/add-user.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { EmailVerificationComponent } from './email-verification/email-verificatiion.component';
import { ProfileSubscriptionsComponent } from './profile-subscriptions/profile-subscriptions.component';
import { SubscriptionsResolver } from 'src/app/shared/components/subscriptions/subscriptions.resolver';


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
    },

    {
        path: "subscriptions",
        component: ProfileSubscriptionsComponent,
        resolve: {
            subsData: SubscriptionsResolver
        }
    },
    {
        path: "trial-active",
        component: TrialActiveComponent,
        resolve: {
            trialActive: TrialActiveResolver
        }
    }


];

@NgModule({
    imports: [ CommonModule, RouterModule.forChild(routes) ],
    providers: [ SubscriptionsResolver, TrialActiveResolver ]
})

export class FirstLoginRoutingModule { }