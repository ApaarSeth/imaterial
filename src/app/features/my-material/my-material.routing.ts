import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { MyMaterialComponent } from './my-material.component';

const routes: Routes = [
    { path: "", component: MyMaterialComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)]
})
export class MyMaterialRoutingModule { }
