import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { UserDetailComponent } from './user-details/user-details.component';

const routes: Routes = [
  {
    path: "user-detail",
    component: UserDetailComponent
  },

  // {
  //   path: 'organisation/update-info',
  //   component: UpdateInfoComponent
  // },

  // {
  //   path: 'organisation/add-user',
  //   component: AddUserComponent
  // }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})

export class UserRoutingModule { }